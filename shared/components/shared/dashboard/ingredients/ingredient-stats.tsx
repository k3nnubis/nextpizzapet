import { CircleDollarSign, Leaf, ShoppingBasket, Sparkles } from "lucide-react";
import type { DashboardIngredient } from "./ingredient-types";

export function IngredientStats({ ingredients }: { ingredients: DashboardIngredient[] }) {
  const popular = ingredients.reduce<DashboardIngredient | null>(
    (best, item) => (!best || item.productsCount > best.productsCount ? item : best),
    null,
  );
  const average = ingredients.length
    ? Math.round(ingredients.reduce((sum, item) => sum + item.price, 0) / ingredients.length)
    : 0;
  const stats = [
    {
      label: "Всего ингредиентов",
      value: ingredients.length,
      icon: Leaf,
      style: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Средняя стоимость",
      value: `${average.toLocaleString("ru-RU")} ₽`,
      icon: CircleDollarSign,
      style: "bg-orange-100 text-orange-700",
    },
    {
      label: "Используются в меню",
      value: ingredients.filter((item) => item.productsCount > 0).length,
      icon: ShoppingBasket,
      style: "bg-blue-100 text-blue-700",
    },
    {
      label: "Самый популярный",
      value: popular?.productsCount ? popular.name : "—",
      icon: Sparkles,
      style: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Статистика ингредиентов">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.style}`}>
              <stat.icon className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xl leading-none font-extrabold">{stat.value}</p>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
