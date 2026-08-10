"use server";

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { revalidatePath } from "next/cache";

export interface IngredientInput {
  name: string;
  price: number;
  imageUrl: string;
}

async function requireAdmin() {
  const session = await getUserSession();
  if (!session) throw new Error("Необходима авторизация администратора.");

  const admin = await prisma.user.findUnique({ where: { id: Number(session.id) } });
  if (!admin || admin.role !== "ADMIN" || admin.status !== "ACTIVE") {
    throw new Error("Недостаточно прав.");
  }
}

function normalizeIngredient(input: IngredientInput) {
  const name = input.name.trim();
  const imageUrl = input.imageUrl.trim();

  if (name.length < 2 || name.length > 80) {
    throw new Error("Название должно содержать от 2 до 80 символов.");
  }
  if (!Number.isInteger(input.price) || input.price < 0 || input.price > 100_000) {
    throw new Error("Стоимость должна быть целым числом от 0 до 100 000 ₽.");
  }
  if (!imageUrl.startsWith("/")) {
    throw new Error("Укажите путь к изображению из папки public, начиная с «/».");
  }

  return { name, price: input.price, imageUrl };
}

function revalidateIngredient(ingredientId: number, productIds: number[] = []) {
  revalidatePath("/dashboard/ingredients");
  revalidatePath(`/dashboard/ingredients/${ingredientId}`);
  revalidatePath("/dashboard/products");
  revalidatePath("/");
  for (const productId of new Set(productIds)) {
    revalidatePath(`/dashboard/products/${productId}`);
    revalidatePath(`/product/${productId}`);
  }
}

async function recalculateCarts(cartIds: number[]) {
  if (!cartIds.length) return;
  const carts = await prisma.cart.findMany({
    where: { id: { in: [...new Set(cartIds)] } },
    select: { token: true },
  });
  await Promise.all(carts.map((cart) => updateCartTotalAmount(cart.token)));
}

export async function createIngredient(input: IngredientInput) {
  await requireAdmin();
  const data = normalizeIngredient(input);
  const ingredient = await prisma.ingredient.create({ data, select: { id: true } });
  revalidateIngredient(ingredient.id);
  return ingredient;
}

export async function updateIngredient(ingredientId: number, input: IngredientInput) {
  await requireAdmin();
  const data = normalizeIngredient(input);
  const ingredient = await prisma.ingredient.findUnique({
    where: { id: ingredientId },
    select: {
      products: { select: { id: true } },
      cartItems: { select: { cartId: true } },
    },
  });
  if (!ingredient) throw new Error("Ингредиент не найден.");

  await prisma.ingredient.update({ where: { id: ingredientId }, data });
  await recalculateCarts(ingredient.cartItems.map((item) => item.cartId));
  revalidateIngredient(
    ingredientId,
    ingredient.products.map((product) => product.id),
  );
}

export async function attachIngredientToProduct(ingredientId: number, productId: number) {
  await requireAdmin();
  const [ingredient, product] = await Promise.all([
    prisma.ingredient.findUnique({ where: { id: ingredientId }, select: { id: true } }),
    prisma.product.findUnique({ where: { id: productId }, select: { type: true } }),
  ]);
  if (!ingredient) throw new Error("Ингредиент не найден.");
  if (!product) throw new Error("Товар не найден.");
  if (product.type !== "PIZZA") throw new Error("Ингредиенты можно назначать только пиццам.");

  await prisma.ingredient.update({
    where: { id: ingredientId },
    data: { products: { connect: { id: productId } } },
  });
  revalidateIngredient(ingredientId, [productId]);
}

export async function detachIngredientFromProduct(ingredientId: number, productId: number) {
  await requireAdmin();
  const ingredient = await prisma.ingredient.findUnique({
    where: { id: ingredientId },
    select: { products: { where: { id: productId }, select: { id: true } } },
  });
  if (!ingredient) throw new Error("Ингредиент не найден.");
  if (!ingredient.products.length) throw new Error("Ингредиент уже не используется в этой пицце.");

  const cartItems = await prisma.cartItem.findMany({
    where: { productItem: { productId }, ingredients: { some: { id: ingredientId } } },
    select: { id: true, cartId: true },
  });
  await prisma.$transaction([
    prisma.ingredient.update({
      where: { id: ingredientId },
      data: { products: { disconnect: { id: productId } } },
    }),
    ...cartItems.map((item) =>
      prisma.cartItem.update({
        where: { id: item.id },
        data: { ingredients: { disconnect: { id: ingredientId } } },
      }),
    ),
  ]);
  await recalculateCarts(cartItems.map((item) => item.cartId));
  revalidateIngredient(ingredientId, [productId]);
}

export async function deleteIngredient(ingredientId: number) {
  await requireAdmin();
  const ingredient = await prisma.ingredient.findUnique({
    where: { id: ingredientId },
    select: {
      products: { select: { id: true } },
      cartItems: { select: { cartId: true } },
    },
  });
  if (!ingredient) throw new Error("Ингредиент не найден.");

  await prisma.ingredient.delete({ where: { id: ingredientId } });
  await recalculateCarts(ingredient.cartItems.map((item) => item.cartId));
  revalidateIngredient(
    ingredientId,
    ingredient.products.map((product) => product.id),
  );
}
