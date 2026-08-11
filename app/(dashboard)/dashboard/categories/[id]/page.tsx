import { prisma } from "@/prisma/prisma-client";
import {
  CategoryDangerZone,
  CategoryNameForm,
  CategoryProductsManager,
  type DashboardCategoryProductDetails,
} from "@/shared/components/shared/dashboard";
import { ArrowLeft, Ban, CircleCheck, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) return { title: "Категория не найдена" };

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { name: true },
  });

  return { title: category ? `Категория: ${category.name}` : "Категория не найдена" };
}

export default async function DashboardCategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) notFound();

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: {
      id: true,
      name: true,
      products: {
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          status: true,
          updatedAt: true,
          variants: {
            select: { price: true },
          },
        },
      },
    },
  });

  if (!category) notFound();

  const products: DashboardCategoryProductDetails[] = category.products.map(
    ({ variants, updatedAt, ...product }) => ({
      ...product,
      prices: variants.map((variant) => variant.price),
      variantsCount: variants.length,
      updatedAt: updatedAt.toISOString(),
    }),
  );
  const activeProductsCount = products.filter((product) => product.status === "ACTIVE").length;
  const blockedProductsCount = products.length - activeProductsCount;

  const stats = [
    { label: "Всего товаров", value: products.length, icon: Package, className: "bg-sky-100 text-sky-700" },
    {
      label: "Доступны",
      value: activeProductsCount,
      icon: CircleCheck,
      className: "bg-emerald-100 text-emerald-700",
    },
    { label: "Заблокированы", value: blockedProductsCount, icon: Ban, className: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <header>
          <Link
            href="/dashboard/categories"
            className="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-bold transition-colors hover:text-violet-700"
          >
            <ArrowLeft className="size-4" /> Все категории
          </Link>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-extrabold tracking-[0.18em] text-violet-600 uppercase">
                Категория #{category.id}
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{category.name}</h1>
            </div>
            <p className="text-muted-foreground max-w-md text-sm sm:text-right">
              Управляйте названием, доступностью и составом категории.
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Статистика категории">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <span className={`flex size-10 items-center justify-center rounded-xl ${stat.className}`}>
                <stat.icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl leading-none font-extrabold">{stat.value}</p>
                <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </section>

        <CategoryNameForm categoryId={category.id} initialName={category.name} />
        <CategoryProductsManager categoryId={category.id} products={products} />
        <CategoryDangerZone
          categoryId={category.id}
          categoryName={category.name}
          productsCount={products.length}
        />
      </div>
    </div>
  );
}
