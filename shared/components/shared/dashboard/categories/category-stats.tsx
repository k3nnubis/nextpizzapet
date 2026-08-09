import type { DashboardCategory } from "./category-types";
import { Boxes, FolderCheck, Layers3 } from "lucide-react";

interface CategoryStatsProps {
  categories: DashboardCategory[];
}

export function CategoryStats({ categories }: CategoryStatsProps) {
  const productsCount = categories.reduce((total, category) => total + category.productsCount, 0);
  const filledCategoriesCount = categories.filter((category) => category.productsCount > 0).length;

  const stats = [
    {
      label: "Всего категорий",
      value: categories.length,
      icon: Layers3,
      iconClassName: "bg-orange-100 text-orange-700",
    },
    {
      label: "Товаров в каталоге",
      value: productsCount,
      icon: Boxes,
      iconClassName: "bg-sky-100 text-sky-700",
    },
    {
      label: "Категорий с товарами",
      value: filledCategoriesCount,
      icon: FolderCheck,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-3" aria-label="Статистика каталога">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center gap-3">
            <span className={`flex size-10 items-center justify-center rounded-xl ${stat.iconClassName}`}>
              <stat.icon className="size-5" />
            </span>
            <div>
              <p className="text-2xl leading-none font-extrabold">{stat.value.toLocaleString("ru-RU")}</p>
              <p className="text-muted-foreground mt-1 text-sm">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
