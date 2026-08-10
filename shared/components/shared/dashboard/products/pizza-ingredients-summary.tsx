"use client";

import {
  attachIngredientToPizza,
  detachIngredientFromPizza,
} from "@/app/(dashboard)/dashboard/products/actions";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { CirclePlus, LoaderCircle, Salad, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import type { DashboardProductIngredient } from "./product-detail-types";

interface PizzaIngredientsSummaryProps {
  productId: number;
  ingredients: DashboardProductIngredient[];
  allIngredients: DashboardProductIngredient[];
}

export function PizzaIngredientsSummary({
  productId,
  ingredients,
  allIngredients,
}: PizzaIngredientsSummaryProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingIngredientId, setPendingIngredientId] = useState<number | null>(null);
  const assignedIds = useMemo(() => new Set(ingredients.map(({ id }) => id)), [ingredients]);
  const availableIngredients = allIngredients.filter(({ id }) => !assignedIds.has(id));

  function updateIngredient(ingredientId: number, action: "attach" | "detach") {
    setPendingIngredientId(ingredientId);
    startTransition(async () => {
      try {
        if (action === "attach") await attachIngredientToPizza(productId, ingredientId);
        else await detachIngredientFromPizza(productId, ingredientId);

        toast.success(action === "attach" ? "Ингредиент добавлен" : "Ингредиент отвязан");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось изменить ингредиенты");
      } finally {
        setPendingIngredientId(null);
      }
    });
  }

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Salad className="size-5" />
          </span>
          <div>
            <h2 className="font-extrabold">Дополнительные ингредиенты</h2>
            <p className="text-muted-foreground text-sm">Опции, доступные покупателю при сборке пиццы.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Badge variant="secondary">{ingredients.length}</Badge>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" disabled={!availableIngredients.length || isPending}>
                <CirclePlus /> Добавить
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-2">
              <div className="px-2 py-1.5">
                <p className="text-sm font-extrabold">Добавить ингредиент</p>
                <p className="text-muted-foreground text-xs">Выберите ингредиент из общего каталога.</p>
              </div>
              <div className="mt-1 max-h-72 space-y-1 overflow-y-auto">
                {availableIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    type="button"
                    disabled={isPending}
                    onClick={() => updateIngredient(ingredient.id, "attach")}
                    className="hover:bg-accent focus-visible:ring-ring flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors outline-none focus-visible:ring-2 disabled:opacity-50"
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-orange-50">
                      <Image
                        src={ingredient.imageUrl}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain p-1"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">{ingredient.name}</span>
                      <span className="text-muted-foreground block text-xs">
                        +{ingredient.price.toLocaleString("ru-RU")} ₽
                      </span>
                    </span>
                    {pendingIngredientId === ingredient.id ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <CirclePlus className="size-4 text-orange-600" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {ingredients.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ingredients.map((ingredient) => (
            <article
              key={ingredient.id}
              className="group relative flex items-center gap-3 rounded-xl border p-3 pr-11"
            >
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
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                disabled={isPending}
                onClick={() => updateIngredient(ingredient.id, "detach")}
                aria-label={`Отвязать ингредиент «${ingredient.name}»`}
                title="Отвязать ингредиент"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-red-600 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-red-50 hover:text-red-700 focus-visible:opacity-100"
              >
                {pendingIngredientId === ingredient.id ? <LoaderCircle className="animate-spin" /> : <X />}
              </Button>
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
