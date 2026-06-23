import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = (await req.json()) as { quantity: number };
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Корзина не найдена" }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!cartItem) {
      return NextResponse.json({ message: "Товар не найден" }, { status: 404 });
    }

    // /cart/3
    // {quantity: 3}

    await prisma.cartItem.update({
      where: {
        id: Number(id),
      },
      data: {
        quantity: data.quantity,
      },
    });

    const updatedUserCart = await updateCartTotalAmount(token);

    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.log("[CART_PATCH] Server error", error);
    return NextResponse.json({ message: "Не удалось обновить корзину" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ message: "Корзина не найдена" }, { status: 404 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!cartItem) {
      return NextResponse.json({ message: "Товар не найден" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        id: Number(id),
      },
    });
    
    const updatedUserCart = await updateCartTotalAmount(token);

    return NextResponse.json(updatedUserCart);
  } catch (error) {
    console.log("[CART_DELETE] Server error", error);
    return NextResponse.json({ message: "Не удалось удалить корзину" }, { status: 500 });
  }
}
