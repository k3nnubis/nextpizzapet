"use server";

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { revalidatePath } from "next/cache";

type ProductStatus = "ACTIVE" | "BLOCKED";
type ProductType = "SIMPLE" | "PIZZA";

export interface UpdateProductInfoInput {
  name: string;
  imageUrl: string;
  categoryId: number | null;
  status: ProductStatus;
  type: ProductType;
}

export interface CreateProductInput {
  name: string;
  imageUrl: string;
  categoryId: number | null;
  type: ProductType;
}

export interface PizzaVariantInput {
  price: number;
  size: 20 | 30 | 40;
  pizzaType: 1 | 2;
}

async function requireAdmin() {
  const session = await getUserSession();
  if (!session) throw new Error("Необходима авторизация администратора.");

  const admin = await prisma.user.findUnique({ where: { id: Number(session.id) } });
  if (!admin || admin.role !== "ADMIN" || admin.status !== "ACTIVE") {
    throw new Error("Недостаточно прав.");
  }
}

function validatePrice(price: number) {
  if (!Number.isInteger(price) || price < 1 || price > 1_000_000) {
    throw new Error("Цена должна быть целым числом от 1 до 1 000 000 ₽.");
  }
}

function normalizeProductIdentity(name: string, imageUrl: string) {
  const normalizedName = name.trim();
  const normalizedImageUrl = imageUrl.trim();

  if (normalizedName.length < 2 || normalizedName.length > 120) {
    throw new Error("Название должно содержать от 2 до 120 символов.");
  }
  if (!normalizedImageUrl.startsWith("/")) {
    throw new Error("Укажите путь к изображению из папки public, начиная с «/».");
  }

  return { name: normalizedName, imageUrl: normalizedImageUrl };
}

function revalidateProduct(productId: number, categoryIds: Array<number | null | undefined> = []) {
  revalidatePath(`/dashboard/products/${productId}`);
  revalidatePath("/dashboard/products");
  revalidatePath(`/product/${productId}`);
  revalidatePath("/");

  new Set(categoryIds.filter((id): id is number => typeof id === "number")).forEach((categoryId) => {
    revalidatePath(`/dashboard/categories/${categoryId}`);
  });
  revalidatePath("/dashboard/categories");
}

async function recalculateCarts(cartIds: number[]) {
  if (!cartIds.length) return;

  const carts = await prisma.cart.findMany({
    where: { id: { in: [...new Set(cartIds)] } },
    select: { token: true },
  });
  await Promise.all(carts.map((cart) => updateCartTotalAmount(cart.token)));
}

async function removeProductFromCarts(productId: number) {
  const items = await prisma.cartItem.findMany({
    where: { productItem: { productId } },
    select: { cartId: true },
  });

  await prisma.cartItem.deleteMany({ where: { productItem: { productId } } });
  await recalculateCarts(items.map((item) => item.cartId));
}

export async function createProduct(input: CreateProductInput) {
  await requireAdmin();

  const identity = normalizeProductIdentity(input.name, input.imageUrl);

  if (input.categoryId !== null) {
    const categoryExists = await prisma.category.count({ where: { id: input.categoryId } });
    if (!categoryExists) throw new Error("Выбранная категория не найдена.");
  }
  if (input.type !== "SIMPLE" && input.type !== "PIZZA") {
    throw new Error("Некорректный тип товара.");
  }

  const product = await prisma.product.create({
    data: {
      ...identity,
      type: input.type,
      categoryId: input.categoryId,
      status: "BLOCKED",
    },
    select: { id: true },
  });

  revalidateProduct(product.id, [input.categoryId]);
  return product;
}

export async function updateProductInfo(productId: number, input: UpdateProductInfoInput) {
  await requireAdmin();

  const identity = normalizeProductIdentity(input.name, input.imageUrl);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true, type: true, _count: { select: { variants: true } } },
  });
  if (!product) throw new Error("Товар не найден.");

  if (input.categoryId !== null) {
    const categoryExists = await prisma.category.count({ where: { id: input.categoryId } });
    if (!categoryExists) throw new Error("Выбранная категория не найдена.");
  }
  if (product.type !== input.type && product._count.variants > 0) {
    throw new Error("Чтобы изменить тип товара, сначала удалите все его варианты.");
  }
  if (input.status === "ACTIVE" && input.categoryId === null) {
    throw new Error("Товар без категории нельзя сделать доступным.");
  }
  if (input.status === "ACTIVE" && product._count.variants === 0) {
    throw new Error("Добавьте хотя бы один вариант перед публикацией товара.");
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      ...identity,
      categoryId: input.categoryId,
      status: input.categoryId === null ? "BLOCKED" : input.status,
      type: input.type,
      ...(input.type === "SIMPLE" ? { ingredients: { set: [] } } : {}),
    },
  });

  if (input.status === "BLOCKED" || input.categoryId === null) await removeProductFromCarts(productId);

  revalidateProduct(productId, [product.categoryId, input.categoryId]);
}

export async function createSimpleVariant(productId: number, price: number) {
  await requireAdmin();
  validatePrice(price);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { type: true, categoryId: true, _count: { select: { variants: true } } },
  });
  if (!product) throw new Error("Товар не найден.");
  if (product.type !== "SIMPLE") throw new Error("Обычный вариант нельзя добавить пицце.");
  if (product._count.variants > 0) throw new Error("У обычного товара может быть только один вариант.");

  await prisma.productItem.create({ data: { productId, price } });
  revalidateProduct(productId, [product.categoryId]);
}

export async function createPizzaVariant(productId: number, input: PizzaVariantInput) {
  await requireAdmin();
  validatePrice(input.price);

  if (![20, 30, 40].includes(input.size) || ![1, 2].includes(input.pizzaType)) {
    throw new Error("Некорректный размер или тип теста.");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { type: true, categoryId: true, _count: { select: { variants: true } } },
  });
  if (!product) throw new Error("Товар не найден.");
  if (product.type !== "PIZZA") throw new Error("Вариант пиццы нельзя добавить обычному товару.");
  if (product._count.variants >= 6) throw new Error("У пиццы не может быть больше шести вариантов.");

  const duplicate = await prisma.productItem.findFirst({
    where: { productId, size: input.size, pizzaType: input.pizzaType },
    select: { id: true },
  });
  if (duplicate) throw new Error("Такой вариант пиццы уже существует.");

  await prisma.productItem.create({ data: { productId, ...input } });
  revalidateProduct(productId, [product.categoryId]);
}

export async function updateProductVariantPrice(productId: number, variantId: number, price: number) {
  await requireAdmin();
  validatePrice(price);

  const variant = await prisma.productItem.findFirst({
    where: { id: variantId, productId },
    select: {
      product: { select: { categoryId: true } },
      cartItems: { select: { cartId: true } },
    },
  });
  if (!variant) throw new Error("Вариант товара не найден.");

  await prisma.productItem.update({ where: { id: variantId }, data: { price } });
  await recalculateCarts(variant.cartItems.map((item) => item.cartId));
  revalidateProduct(productId, [variant.product.categoryId]);
}

export async function deleteProductVariant(productId: number, variantId: number) {
  await requireAdmin();

  const variant = await prisma.productItem.findFirst({
    where: { id: variantId, productId },
    select: {
      product: { select: { categoryId: true, _count: { select: { variants: true } } } },
      cartItems: { select: { cartId: true } },
    },
  });
  if (!variant) throw new Error("Вариант товара не найден.");

  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { productItemId: variantId } }),
    prisma.productItem.delete({ where: { id: variantId } }),
    ...(variant.product._count.variants === 1
      ? [prisma.product.update({ where: { id: productId }, data: { status: "BLOCKED" } })]
      : []),
  ]);

  await recalculateCarts(variant.cartItems.map((item) => item.cartId));
  revalidateProduct(productId, [variant.product.categoryId]);
}
