import { prisma } from "@/prisma/prisma-client";
import { ArrowUpRight, Folder, Leaf, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const [users, categories, products, ingredients, orders] = await Promise.all([
    prisma.user.count(),
    prisma.category.count(),
    prisma.product.count(),
    prisma.ingredient.count(),
    prisma.order.count(),
  ]);
  const sections = [
    {
      label: "Пользователи",
      value: users,
      href: "/dashboard/users",
      icon: Users,
      color: "bg-sky-100 text-sky-700",
      hover: "hover:border-sky-200 hover:shadow-sky-100/70",
    },
    {
      label: "Категории",
      value: categories,
      href: "/dashboard/categories",
      icon: Folder,
      color: "bg-violet-100 text-violet-700",
      hover: "hover:border-violet-200 hover:shadow-violet-100/70",
    },
    {
      label: "Продукты",
      value: products,
      href: "/dashboard/products",
      icon: Package,
      color: "bg-orange-100 text-orange-700",
      hover: "hover:border-orange-200 hover:shadow-orange-100/70",
    },
    {
      label: "Ингредиенты",
      value: ingredients,
      href: "/dashboard/ingredients",
      icon: Leaf,
      color: "bg-emerald-100 text-emerald-700",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/70",
    },
    {
      label: "Заказы",
      value: orders,
      href: "/dashboard/users",
      icon: ShoppingCart,
      color: "bg-rose-100 text-rose-700",
      hover: "hover:border-rose-200 hover:shadow-rose-100/70",
    },
  ];

  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-7">
        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10">
          <div className="absolute -top-24 -right-12 size-72 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-28 left-1/4 size-64 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-indigo-400 uppercase">
              Центр управления
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Панель администратора</h1>
            <p className="mt-3 text-sm leading-6 text-gray-300 sm:text-base">
              Всё меню и работа магазина — в одном месте. Каждый раздел теперь легко узнать по собственному
              цветовому акценту.
            </p>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-label="Разделы панели управления">
          {sections.map((section) => (
            <Link
              key={section.label}
              href={section.href}
              className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${section.hover}`}
            >
              <div className="flex items-start justify-between">
                <span className={`flex size-11 items-center justify-center rounded-xl ${section.color}`}>
                  <section.icon className="size-5" />
                </span>
                <ArrowUpRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="mt-5 text-3xl font-black">{section.value.toLocaleString("ru-RU")}</p>
              <p className="text-muted-foreground mt-1 text-sm font-semibold">{section.label}</p>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
