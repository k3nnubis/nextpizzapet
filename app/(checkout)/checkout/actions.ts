"use server";
import { prisma } from "@/prisma/prisma-client";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment, sendEmail } from "@/shared/lib";
import { OrderStatus } from "@/src/generated/prisma/enums";
import { OrderBlank } from "../../../shared/components/shared";
import { cookies } from "next/headers";
import { getUserSession } from "@/shared/lib/get-user-session";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const currentUser = await getUserSession();
    const userId = Number(currentUser?.id);
    // Корзина гостя привязана к токену, который хранится в cookie.
    const cookieStore = cookies();
    const cartToken = (await cookieStore).get("cartToken")?.value;
    if (!cartToken) throw new Error("Cart token not found");

    // Загружаем корзину целиком: эти данные будут сохранены как снимок заказа.
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        OR: [
          {
            userId,
          },
          {
            token: cartToken,
          },
        ],
      },
    });
    if (!userCart) throw new Error("Cart not found");
    if (userCart?.totalAmount === 0) throw new Error("Cart is empty");

    // Создаём заказ до очистки корзины, чтобы не потерять её состав.
    const order = await prisma.order.create({
      data: {
        userId,
        token: cartToken,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.order_comment,
        status: OrderStatus.PENDING,
        totalAmount: userCart.totalAmount,
        items: JSON.stringify(userCart.items),
      },
    });

    // После оформления сбрасываем итоговую стоимость использованной корзины.
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    // Удаляем позиции, чтобы корзина была готова к следующему заказу.
    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    const paymentData = await createPayment({
      amount: order.totalAmount,
      orderId: order.id,
      description: "Оплата заказа #" + order.id,
    });

    if (!paymentData) {
      throw new Error("Payment error");
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentData.id,
      },
    });
    const paymentUrl = paymentData.confirmation.confirmation_url;
    await sendEmail(
      data.email,
      "Next Pizza / Оплатите заказ #" + order.id,
      OrderBlank({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl,
      }),
    );
    return paymentUrl;
  } catch (error) {
    console.log(error);
    return null;
  }
}
