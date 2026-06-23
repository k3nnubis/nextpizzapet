import { prisma } from "@/prisma/prisma-client";
import { findOrCreateCart } from "@/shared/lib/find-or-create-cart";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { CreateCartItemValues } from "@/shared/services/dto/cart.dto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;
    if (!token) return NextResponse.json({ totalAmount: 0, items: [] });

    const userCart = await prisma.cart.findFirst({
      where: {
        token,
      },
      include: {
        items: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });
    return NextResponse.json(userCart);
  } catch (error) {
    console.log("[CART_GET] Server error", error);
    return NextResponse.json({ message: "Не удалось получить корзину" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json().catch(() => null)) as CreateCartItemValues | null;

    if (!data || typeof data.productItemId !== "number") {
      return NextResponse.json({ message: "Некорректный productItemId" }, { status: 400 });
    }

    const ingredients = Array.isArray(data.ingredients)
      ? Array.from(new Set(data.ingredients.filter((id) => typeof id === "number")))
      : [];

    let token = req.cookies.get("cartToken")?.value;

    if (!token) {
      token = crypto.randomUUID();
    }
    const userCart = await findOrCreateCart(token);

    const cartItems = await prisma.cartItem.findMany({
      where: {
        cartId: userCart.id,
        productItemId: data.productItemId,
      },
      include: {
        ingredients: true,
      },
    });

    const requestIngredients = [...ingredients].sort((a, b) => a - b);
    const findCartItem = cartItems.find((item) => {
      const itemIngredients = item.ingredients.map((ingredient) => ingredient.id).sort((a, b) => a - b);

      return (
        itemIngredients.length === requestIngredients.length &&
        itemIngredients.every((id, index) => id === requestIngredients[index])
      );
    });

    /// Если товар был найден, делаем + 1
    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + 1,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productItemId: data.productItemId,
          quantity: 1,
          ingredients: { connect: ingredients.map((id) => ({ id })) },
        },
      });
    }

    const updatedUserCart = await updateCartTotalAmount(token);

    const resp = NextResponse.json(updatedUserCart);
    resp.cookies.set("cartToken", token);
    return resp;
  } catch (error) {
    console.log("[CART_POST] Server error", error);
    return NextResponse.json({ message: "Не удалось создать корзину" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Корзина не найдена" }, { status: 404 });
    }

    const userCart = await prisma.cart.findFirst({
      where: { token },
    });

    if (!userCart) {
      return NextResponse.json({ message: "Корзина не найдена" }, { status: 404 });
    }

    const deletedItems = await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    const updatedCart = await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
      include: {
        items: {
          include: {
            productItem: {
              include: {
                product: true,
              },
            },
            ingredients: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.log("[CART_DELETE] Server error", error);
    return NextResponse.json({ message: "Не удалось удалить корзину" }, { status: 500 });
  }
}
