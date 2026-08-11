"use client";

import { Input } from "@/shared/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { PackageSearch, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { DashboardCategoryProductDetails } from "./category-detail-types";
import { CategoryProductRow } from "./category-product-row";

interface CategoryProductsManagerProps {
  categoryId: number;
  products: DashboardCategoryProductDetails[];
}

type StatusFilter = "ALL" | "ACTIVE" | "BLOCKED";

export function CategoryProductsManager({ categoryId, products }: CategoryProductsManagerProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        String(product.id).includes(normalizedQuery);
      const matchesStatus = status === "ALL" || product.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [products, query, status]);

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-extrabold">Товары категории</h2>
          <p className="text-muted-foreground text-sm">
            Показано {filteredProducts.length} из {products.length}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название или ID"
              aria-label="Поиск товаров категории"
              className="h-10 pl-9"
            />
          </div>
          <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
            <SelectTrigger className="h-10 w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все статусы</SelectItem>
              <SelectItem value="ACTIVE">Доступные</SelectItem>
              <SelectItem value="BLOCKED">Заблокированные</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredProducts.length ? (
        <div className="divide-y">
          {filteredProducts.map((product) => (
            <CategoryProductRow key={product.id} categoryId={categoryId} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
          <span className="bg-muted flex size-14 items-center justify-center rounded-2xl">
            <PackageSearch className="text-muted-foreground size-6" />
          </span>
          <h3 className="mt-4 font-extrabold">Товары не найдены</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {products.length ? "Измените запрос или фильтр статуса." : "В этой категории пока нет товаров."}
          </p>
        </div>
      )}
    </section>
  );
}
