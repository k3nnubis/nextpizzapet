import { Ban, Boxes, CircleCheck, FolderX } from "lucide-react";
import type { DashboardProduct } from "./product-types";

interface ProductStatsProps {
  products: DashboardProduct[];
}

export function ProductStats({ products }: ProductStatsProps) {
  const stats = [
    {
      label: "Всего товаров",
      value: products.length,
      icon: Boxes,
      iconClassName: "bg-orange-100 text-orange-700",
    },
    {
      label: "Доступны к заказу",
      value: products.filter(
        (product) => product.status === "ACTIVE" && product.category && product.variantsCount > 0,
      ).length,
      icon: CircleCheck,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Заблокированы",
      value: products.filter((product) => product.status === "BLOCKED").length,
      icon: Ban,
      iconClassName: "bg-red-100 text-red-700",
    },
    {
      label: "Без категории",
      value: products.filter((product) => !product.category).length,
      icon: FolderX,
      iconClassName: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Статистика товаров">
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
