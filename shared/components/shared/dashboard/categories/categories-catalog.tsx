"use client";

import { Input } from "@/shared/components/ui/input";
import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryCard } from "./category-card";
import type { DashboardCategory } from "./category-types";

interface CategoriesCatalogProps {
  categories: DashboardCategory[];
}

export function CategoriesCatalog({ categories }: CategoriesCatalogProps) {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");

    if (!normalizedQuery) return categories;

    return categories.filter(
      (category) =>
        category.name.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        String(category.id).includes(normalizedQuery),
    );
  }, [categories, query]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-extrabold">Каталог категорий</h2>
          <p className="text-muted-foreground text-sm">
            {filteredCategories.length === categories.length
              ? `${categories.length} категорий`
              : `Найдено ${filteredCategories.length} из ${categories.length}`}
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Название или ID"
            aria-label="Поиск категорий"
            className="h-11 bg-white pl-9 shadow-sm"
          />
        </div>
      </div>

      {filteredCategories.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed bg-white px-5 text-center">
          <span className="bg-muted flex size-14 items-center justify-center rounded-2xl">
            <SearchX className="text-muted-foreground size-6" />
          </span>
          <h3 className="mt-4 font-extrabold">Категории не найдены</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            Проверьте название или попробуйте другой запрос.
          </p>
        </div>
      )}
    </section>
  );
}
