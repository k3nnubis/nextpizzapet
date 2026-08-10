import { prisma } from "@/prisma/prisma-client";
import {
  CreateIngredientDialog,
  IngredientStats,
  IngredientsCatalog,
  type DashboardIngredient,
} from "@/shared/components/shared/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Ингредиенты" };

export default async function DashboardIngredientsPage() {
  const data = await prisma.ingredient.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      price: true,
      imageUrl: true,
      updatedAt: true,
      _count: { select: { products: true, cartItems: true } },
    },
  });
  const ingredients: DashboardIngredient[] = data.map(({ _count, updatedAt, ...item }) => ({
    ...item,
    productsCount: _count.products,
    cartItemsCount: _count.cartItems,
    updatedAt: updatedAt.toISOString(),
  }));

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-7">
        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-emerald-500/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-emerald-400 uppercase">
                Библиотека добавок
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Ингредиенты</h1>
              <p className="mt-2 text-sm leading-6 text-gray-300 sm:text-base">
                Управляйте составом меню, стоимостью добавок и следите, где используется каждый ингредиент.
              </p>
            </div>
            <CreateIngredientDialog />
          </div>
        </header>
        <IngredientStats ingredients={ingredients} />
        <IngredientsCatalog ingredients={ingredients} />
      </div>
    </div>
  );
}
