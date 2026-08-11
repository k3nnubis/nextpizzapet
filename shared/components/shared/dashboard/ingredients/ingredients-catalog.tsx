"use client";

import { Input } from "@/shared/components/ui";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ArrowUpDown, ImageIcon, Leaf, Search, ShoppingBasket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DashboardIngredient } from "./ingredient-types";

type SortMode = "updated" | "name" | "price" | "popular";

export function IngredientsCatalog({ ingredients }: { ingredients: DashboardIngredient[] }) {
  const [query, setQuery] = useState("");
  const [onlyUnused, setOnlyUnused] = useState(false);
  const [sort, setSort] = useState<SortMode>("updated");
  const items = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru-RU");
    return ingredients
      .filter(
        (item) =>
          (!normalized ||
            item.name.toLocaleLowerCase("ru-RU").includes(normalized) ||
            String(item.id).includes(normalized)) &&
          (!onlyUnused || item.productsCount === 0),
      )
      .sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name, "ru")
          : sort === "price"
            ? b.price - a.price
            : sort === "popular"
              ? b.productsCount - a.productsCount
              : +new Date(b.updatedAt) - +new Date(a.updatedAt),
      );
  }, [ingredients, onlyUnused, query, sort]);

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold">Библиотека ингредиентов</h2>
            <p className="text-muted-foreground text-sm">
              Показано {items.length} из {ingredients.length}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-3xl">
            <div className="relative flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Название или ID"
                className="h-10 pl-9"
              />
            </div>
            <button
              type="button"
              onClick={() => setOnlyUnused((value) => !value)}
              className={`h-10 rounded-md border px-3 text-sm font-bold transition-colors ${onlyUnused ? "border-amber-300 bg-amber-50 text-amber-900" : "hover:bg-muted"}`}
            >
              Не используются
            </button>
            <Select value={sort} onValueChange={(value) => setSort(value as SortMode)}>
              <SelectTrigger className="h-10 w-full font-medium sm:w-52">
                <ArrowUpDown className="text-muted-foreground size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Сначала новые</SelectItem>
                <SelectItem value="popular">По популярности</SelectItem>
                <SelectItem value="price">По стоимости</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {items.length ? (
        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/ingredients/${item.id}`}
              className="group rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div className="flex gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-emerald-50">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2 transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon className="text-muted-foreground absolute inset-0 m-auto size-6" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-extrabold group-hover:text-emerald-700">{item.name}</p>
                  <p className="text-muted-foreground text-xs">ID #{item.id}</p>
                  <p className="mt-2 text-xl font-black">{item.price.toLocaleString("ru-RU")} ₽</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <Badge
                  variant="outline"
                  className={
                    item.productsCount
                      ? "border-blue-200 bg-blue-50 text-blue-800"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }
                >
                  <ShoppingBasket />{" "}
                  {item.productsCount ? `В ${item.productsCount} продуктах` : "Не используется"}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {new Date(item.updatedAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
          <span className="bg-muted flex size-14 items-center justify-center rounded-2xl">
            <Leaf className="text-muted-foreground size-6" />
          </span>
          <h3 className="mt-4 font-extrabold">Ингредиенты не найдены</h3>
          <p className="text-muted-foreground mt-1 text-sm">Измените поиск или выбранный фильтр.</p>
        </div>
      )}
    </section>
  );
}
