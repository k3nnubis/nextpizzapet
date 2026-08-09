import { prisma } from "@/prisma/prisma-client";
import {
  CategoriesCatalog,
  CreateCategoryDialog,
  CategoryStats,
  type DashboardCategory,
} from "@/shared/components/shared/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Категории",
};

export default async function DashboardCategoriesPage() {
  const categoriesData = await prisma.category.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      updatedAt: true,
      _count: { select: { products: true } },
      products: {
        orderBy: { id: "asc" },
        take: 3,
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  const categories: DashboardCategory[] = categoriesData.map(({ _count, updatedAt, ...category }) => ({
    ...category,
    updatedAt: updatedAt.toISOString(),
    productsCount: _count.products,
  }));

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-7">
        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-orange-400 uppercase">
                Структура каталога
              </p>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Категории</h1>
              <p className="mt-2 text-sm leading-6 text-gray-300 sm:text-base">
                Просматривайте разделы меню и контролируйте распределение товаров по каталогу.
              </p>
            </div>
            <CreateCategoryDialog />
          </div>
        </header>

        <CategoryStats categories={categories} />
        <CategoriesCatalog categories={categories} />
      </div>
    </div>
  );
}
