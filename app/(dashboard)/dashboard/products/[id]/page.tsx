import type { UpdateProductInfoInput } from "@/app/(dashboard)/dashboard/products/actions";
import { prisma } from "@/prisma/prisma-client";
import {
  PizzaIngredientsSummary,
  ProductInfoForm,
  ProductVariantsEditor,
  type DashboardProductIngredient,
  type DashboardProductVariant,
} from "@/shared/components/shared/dashboard";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, Boxes, CircleCheck, Folder, Pizza } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface DashboardProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DashboardProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) return { title: "Товар не найден" };

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { name: true } });
  return { title: product ? `Товар: ${product.name}` : "Товар не найден" };
}

export default async function DashboardProductPage({ params }: DashboardProductPageProps) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) notFound();

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        status: true,
        type: true,
        categoryId: true,
        category: { select: { name: true } },
        variants: {
          orderBy: [{ pizzaType: "asc" }, { size: "asc" }],
          select: { id: true, price: true, size: true, pizzaType: true },
        },
        ingredients: {
          orderBy: { name: "asc" },
          select: { id: true, name: true, price: true, imageUrl: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const initialValues: UpdateProductInfoInput = {
    name: product.name,
    imageUrl: product.imageUrl,
    categoryId: product.categoryId,
    status: product.status,
    type: product.type,
  };
  const variants: DashboardProductVariant[] = product.variants;
  const ingredients: DashboardProductIngredient[] = product.ingredients;

  const summary = [
    {
      label: "Тип",
      value: product.type === "PIZZA" ? "Пицца" : "Обычный товар",
      icon: product.type === "PIZZA" ? Pizza : Boxes,
    },
    {
      label: "Категория",
      value: product.category?.name ?? "Без категории",
      icon: Folder,
    },
    {
      label: "Варианты",
      value: String(product.variants.length),
      icon: CircleCheck,
    },
  ];

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <header>
          <Link
            href="/dashboard/products"
            className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
          >
            <ArrowLeft className="size-4" /> Все товары
          </Link>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-extrabold tracking-[0.18em] text-orange-600 uppercase">
                  Товар #{product.id}
                </p>
                <Badge
                  variant="outline"
                  className={
                    product.status === "ACTIVE" && product.categoryId && product.variants.length > 0
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-800"
                  }
                >
                  {product.status === "ACTIVE" && product.categoryId && product.variants.length > 0
                    ? "Доступен"
                    : "Заблокирован"}
                </Badge>
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{product.name}</h1>
            </div>
            <p className="text-muted-foreground max-w-md text-sm sm:text-right">
              Редактируйте карточку товара и управляйте доступными покупателю вариантами.
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-3" aria-label="Сводка по товару">
          {summary.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                <item.icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">{item.label}</p>
                <p className="truncate font-extrabold">{item.value}</p>
              </div>
            </div>
          ))}
        </section>

        <ProductInfoForm
          key={`${product.name}-${product.imageUrl}-${product.type}-${product.status}-${product.categoryId}-${variants.length}`}
          productId={product.id}
          initialValues={initialValues}
          variantsCount={variants.length}
          categories={categories}
        />

        <ProductVariantsEditor productId={product.id} productType={product.type} variants={variants} />

        {product.type === "PIZZA" && <PizzaIngredientsSummary ingredients={ingredients} />}
      </div>
    </div>
  );
}
