import { Badge } from "@/shared/components/ui/badge";
import { Salad } from "lucide-react";
import Image from "next/image";
import type { DashboardProductIngredient } from "./product-detail-types";

interface PizzaIngredientsSummaryProps {
  ingredients: DashboardProductIngredient[];
}

export function PizzaIngredientsSummary({ ingredients }: PizzaIngredientsSummaryProps) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Salad className="size-5" />
          </span>
          <div>
            <h2 className="font-extrabold">Дополнительные ингредиенты</h2>
            <p className="text-muted-foreground text-sm">Опции, доступные покупателю при сборке пиццы.</p>
          </div>
        </div>
        <Badge variant="secondary">{ingredients.length}</Badge>
      </div>

      {ingredients.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ingredients.map((ingredient) => (
            <article key={ingredient.id} className="flex items-center gap-3 rounded-xl border p-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src={ingredient.imageUrl}
                  alt={ingredient.name}
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{ingredient.name}</p>
                <p className="text-muted-foreground text-xs">+{ingredient.price.toLocaleString("ru-RU")} ₽</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground mt-5 rounded-xl border border-dashed p-5 text-center text-sm">
          Для этой пиццы дополнительные ингредиенты не назначены.
        </p>
      )}
    </section>
  );
}
