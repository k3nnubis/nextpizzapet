"use server";

import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { revalidatePath } from "next/cache";

type ProductStatus = "ACTIVE" | "BLOCKED";

async function requireAdmin() {
  const session = await getUserSession();

  if (!session) throw new Error("Необходима авторизация администратора.");

  const admin = await prisma.user.findUnique({ where: { id: Number(session.id) } });

  if (!admin || admin.role !== "ADMIN" || admin.status !== "ACTIVE") {
    throw new Error("Недостаточно прав.");
  }
}

function revalidateCategory(categoryId: number) {
  revalidatePath(`/dashboard/categories/${categoryId}`);
  revalidatePath("/dashboard/categories");
  revalidatePath("/");
}

async function removeProductFromActiveCarts(productId: number) {
  const cartItems = await prisma.cartItem.findMany({
    where: { productItem: { productId } },
    select: { cartId: true },
  });
  const cartIds = [...new Set(cartItems.map((item) => item.cartId))];

  if (!cartIds.length) return;

  await prisma.cartItem.deleteMany({
    where: { productItem: { productId } },
  });

  const carts = await prisma.cart.findMany({
    where: { id: { in: cartIds } },
    select: { token: true },
  });

  await Promise.all(carts.map((cart) => updateCartTotalAmount(cart.token)));
}

function normalizeCategoryName(name: string) {
  const normalizedName = name.trim();

  if (normalizedName.length < 2) throw new Error("Название должно содержать минимум 2 символа.");
  if (normalizedName.length > 80) throw new Error("Название не должно быть длиннее 80 символов.");

  return normalizedName;
}

async function ensureCategoryNameAvailable(name: string, excludedCategoryId?: number) {
  const duplicate = await prisma.category.findFirst({
    where: {
      ...(excludedCategoryId ? { id: { not: excludedCategoryId } } : {}),
      name: { equals: name, mode: "insensitive" },
    },
    select: { id: true },
  });

  if (duplicate) throw new Error("Категория с таким названием уже существует.");
}

export async function createCategory(name: string) {
  await requireAdmin();

  const normalizedName = normalizeCategoryName(name);
  await ensureCategoryNameAvailable(normalizedName);

  const category = await prisma.category.create({
    data: { name: normalizedName },
    select: { id: true },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/");

  return category;
}

export async function updateCategoryName(categoryId: number, name: string) {
  await requireAdmin();

  const normalizedName = normalizeCategoryName(name);
  await ensureCategoryNameAvailable(normalizedName, categoryId);

  await prisma.category.update({
    where: { id: categoryId },
    data: { name: normalizedName },
  });

  revalidateCategory(categoryId);
}

export async function setDashboardProductStatus(
  categoryId: number,
  productId: number,
  status: ProductStatus,
) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true },
  });
  if (!product || product.categoryId !== categoryId) throw new Error("Товар не найден в этой категории.");

  await prisma.product.update({ where: { id: productId }, data: { status } });

  if (status === "BLOCKED") await removeProductFromActiveCarts(productId);

  revalidateCategory(categoryId);
  revalidatePath(`/product/${productId}`);
}

export async function removeProductFromCategory(categoryId: number, productId: number) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { categoryId: true },
  });
  if (!product || product.categoryId !== categoryId) throw new Error("Товар не найден в этой категории.");

  await prisma.product.update({
    where: { id: productId },
    data: { categoryId: null, status: "BLOCKED" },
  });
  await removeProductFromActiveCarts(productId);

  revalidateCategory(categoryId);
  revalidatePath(`/product/${productId}`);
}

export async function deleteCategory(categoryId: number) {
  await requireAdmin();

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      name: true,
      products: { select: { id: true } },
    },
  });
  if (!category) throw new Error("Категория не найдена.");

  const productIds = category.products.map((product) => product.id);
  const cartItems = productIds.length
    ? await prisma.cartItem.findMany({
        where: { productItem: { productId: { in: productIds } } },
        select: { cartId: true },
      })
    : [];
  const cartIds = [...new Set(cartItems.map((item) => item.cartId))];

  await prisma.$transaction([
    prisma.cartItem.deleteMany({
      where: { productItem: { productId: { in: productIds } } },
    }),
    prisma.product.updateMany({
      where: { categoryId },
      data: { categoryId: null, status: "BLOCKED" },
    }),
    prisma.category.delete({ where: { id: categoryId } }),
  ]);

  if (cartIds.length) {
    const carts = await prisma.cart.findMany({
      where: { id: { in: cartIds } },
      select: { token: true },
    });
    await Promise.all(carts.map((cart) => updateCartTotalAmount(cart.token)));
  }

  productIds.forEach((productId) => revalidatePath(`/product/${productId}`));
  revalidatePath("/dashboard/categories");
  revalidatePath("/");

  return { name: category.name };
}
