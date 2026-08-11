import type { IngredientInput } from "@/app/(dashboard)/dashboard/ingredients/actions";
import { prisma } from "@/prisma/prisma-client";
import {
  IngredientDangerZone,
  IngredientInfoForm,
  IngredientProductsManager,
  type IngredientProduct,
} from "@/shared/components/shared/dashboard";
import { Badge } from "@/shared/components/ui/badge";
import { ArrowLeft, CircleDollarSign, Link2, ShoppingCart } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ingredientId = Number((await params).id);
  if (!Number.isInteger(ingredientId) || ingredientId <= 0) return { title: "Ингредиент не найден" };
  const ingredient = await prisma.ingredient.findUnique({
    where: { id: ingredientId },
    select: { name: true },
  });
  return { title: ingredient ? `Ингредиент: ${ingredient.name}` : "Ингредиент не найден" };
}

export default async function DashboardIngredientPage({ params }: Props) {
  const ingredientId = Number((await params).id);
  if (!Number.isInteger(ingredientId) || ingredientId <= 0) notFound();
  const [ingredient, pizzas] = await Promise.all([
    prisma.ingredient.findUnique({
      where: { id: ingredientId },
      select: {
        id: true,
        name: true,
        price: true,
        imageUrl: true,
        products: {
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            imageUrl: true,
            status: true,
            category: { select: { name: true } },
          },
        },
        _count: { select: { products: true, cartItems: true } },
      },
    }),
    prisma.product.findMany({
      where: { type: "PIZZA" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, imageUrl: true, status: true, category: { select: { name: true } } },
    }),
  ]);
  if (!ingredient) notFound();
  const usedIds = new Set(ingredient.products.map((product) => product.id));
  const availableProducts: IngredientProduct[] = pizzas.filter((product) => !usedIds.has(product.id));
  const initialValues: IngredientInput = {
    name: ingredient.name,
    price: ingredient.price,
    imageUrl: ingredient.imageUrl,
  };
  const summary = [
    {
      label: "Стоимость добавки",
      value: `${ingredient.price.toLocaleString("ru-RU")} ₽`,
      icon: CircleDollarSign,
      style: "bg-orange-100 text-orange-700",
    },
    {
      label: "В составе продуктов",
      value: String(ingredient._count.products),
      icon: Link2,
      style: "bg-blue-100 text-blue-700",
    },
    {
      label: "Сейчас в корзинах",
      value: String(ingredient._count.cartItems),
      icon: ShoppingCart,
      style: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        <header>
          <Link
            href="/dashboard/ingredients"
            className="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-bold hover:text-emerald-700"
          >
            <ArrowLeft className="size-4" /> Все ингредиенты
          </Link>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-extrabold tracking-[0.18em] text-emerald-600 uppercase">
                  Ингредиент #{ingredient.id}
                </p>
                <Badge
                  variant="outline"
                  className={
                    ingredient._count.products
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }
                >
                  {ingredient._count.products ? "В меню" : "Не используется"}
                </Badge>
              </div>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">{ingredient.name}</h1>
            </div>
            <p className="text-muted-foreground max-w-md text-sm sm:text-right">
              Изменения применяются глобально — во всех продуктах и активных корзинах покупателей.
            </p>
          </div>
        </header>
        <section className="grid gap-3 sm:grid-cols-3">
          {summary.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm"
            >
              <span className={`flex size-10 items-center justify-center rounded-xl ${item.style}`}>
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="text-muted-foreground text-xs">{item.label}</p>
                <p className="font-extrabold">{item.value}</p>
              </div>
            </div>
          ))}
        </section>
        <IngredientInfoForm
          key={`${ingredient.name}-${ingredient.price}-${ingredient.imageUrl}`}
          ingredientId={ingredient.id}
          initialValues={initialValues}
        />
        <IngredientProductsManager
          key={`${ingredient.products.map((product) => product.id).join("-")}:${availableProducts.map((product) => product.id).join("-")}`}
          ingredientId={ingredient.id}
          products={ingredient.products}
          availableProducts={availableProducts}
        />
        <IngredientDangerZone
          ingredientId={ingredient.id}
          name={ingredient.name}
          productsCount={ingredient._count.products}
          cartsCount={ingredient._count.cartItems}
        />
      </div>
    </div>
  );
}
