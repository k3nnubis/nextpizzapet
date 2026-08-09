import { prisma } from "@/prisma/prisma-client";
import { ProductsCatalog, ProductStats, type DashboardProduct } from "@/shared/components/shared/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Товары",
};

export default async function DashboardProductsPage() {
  const [productsData, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        status: true,
        updatedAt: true,
        category: {
          select: { id: true, name: true },
        },
        variants: {
          select: { price: true },
        },
        _count: {
          select: { variants: true, ingredients: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  const products: DashboardProduct[] = productsData.map(({ variants, _count, updatedAt, ...product }) => ({
    ...product,
    prices: variants.map((variant) => variant.price),
    variantsCount: _count.variants,
    ingredientsCount: _count.ingredients,
    updatedAt: updatedAt.toISOString(),
  }));

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-7">
        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-orange-500/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-orange-400 uppercase">
              Управление меню
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Товары</h1>
            <p className="mt-2 text-sm leading-6 text-gray-300 sm:text-base">
              Контролируйте ассортимент, доступность, цены и распределение товаров по категориям.
            </p>
          </div>
        </header>

        <ProductStats products={products} />
        <ProductsCatalog products={products} categories={categories} />
      </div>
    </div>
  );
}
