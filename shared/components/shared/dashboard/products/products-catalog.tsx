"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Boxes, FolderX, ImageIcon, PackageSearch, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { DashboardProduct, DashboardProductCategory } from "./product-types";

interface ProductsCatalogProps {
  products: DashboardProduct[];
  categories: DashboardProductCategory[];
}

type StatusFilter = "ALL" | "ACTIVE" | "BLOCKED";
type ProductTypeFilter = "ALL" | "SIMPLE" | "PIZZA";
const ALL_CATEGORIES = "ALL";
const WITHOUT_CATEGORY = "WITHOUT_CATEGORY";

function formatPriceRange(prices: number[]) {
  if (!prices.length) return "Не указана";

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) return `${min.toLocaleString("ru-RU")} ₽`;
  return `${min.toLocaleString("ru-RU")}–${max.toLocaleString("ru-RU")} ₽`;
}

function ProductStatusBadge({ product }: { product: DashboardProduct }) {
  const isAvailable = product.status === "ACTIVE" && product.category !== null && product.variantsCount > 0;

  return (
    <Badge
      variant="outline"
      className={
        isAvailable
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }
    >
      {isAvailable ? "Доступен" : "Заблокирован"}
    </Badge>
  );
}

function ProductCategoryBadge({ product }: { product: DashboardProduct }) {
  if (!product.category) {
    return (
      <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-800">
        <FolderX /> Без категории
      </Badge>
    );
  }

  return <Badge variant="secondary">{product.category.name}</Badge>;
}

function ProductTypeBadge({ type }: { type: DashboardProduct["type"] }) {
  return (
    <Badge
      variant="outline"
      className={type === "PIZZA" ? "border-orange-200 bg-orange-50 text-orange-800" : ""}
    >
      {type === "PIZZA" ? "Пицца" : "Обычный товар"}
    </Badge>
  );
}

export function ProductsCatalog({ products, categories }: ProductsCatalogProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [productType, setProductType] = useState<ProductTypeFilter>("ALL");
  const [category, setCategory] = useState(ALL_CATEGORIES);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ru-RU");

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        product.category?.name.toLocaleLowerCase("ru-RU").includes(normalizedQuery) ||
        String(product.id).includes(normalizedQuery);
      const matchesStatus = status === "ALL" || product.status === status;
      const matchesType = productType === "ALL" || product.type === productType;
      const matchesCategory =
        category === ALL_CATEGORIES ||
        (category === WITHOUT_CATEGORY
          ? product.category === null
          : product.category?.id === Number(category));

      return matchesQuery && matchesStatus && matchesType && matchesCategory;
    });
  }, [category, productType, products, query, status]);

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b p-4 sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-lg font-extrabold">Каталог товаров</h2>
            <p className="text-muted-foreground text-sm">
              Показано {filteredProducts.length} из {products.length}
            </p>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 xl:max-w-4xl xl:grid-cols-[minmax(220px,1fr)_170px_180px_200px]">
            <div className="relative sm:col-span-2 xl:col-span-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Название, категория или ID"
                aria-label="Поиск товаров"
                className="h-10 pl-9"
              />
            </div>
            <Select value={status} onValueChange={(value) => setStatus(value as StatusFilter)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все статусы</SelectItem>
                <SelectItem value="ACTIVE">Активные</SelectItem>
                <SelectItem value="BLOCKED">Заблокированные</SelectItem>
              </SelectContent>
            </Select>
            <Select value={productType} onValueChange={(value) => setProductType(value as ProductTypeFilter)}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все типы</SelectItem>
                <SelectItem value="SIMPLE">Обычные товары</SelectItem>
                <SelectItem value="PIZZA">Пиццы</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_CATEGORIES}>Все категории</SelectItem>
                <SelectItem value={WITHOUT_CATEGORY}>Без категории</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredProducts.length ? (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Товар</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Конфигурация</TableHead>
                  <TableHead className="pr-5">Обновлён</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-contain p-1.5"
                            />
                          ) : (
                            <ImageIcon className="text-muted-foreground absolute inset-0 m-auto size-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/products/${product.id}`}
                            className="hover:text-primary block max-w-72 truncate font-extrabold transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="text-muted-foreground text-xs">ID #{product.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ProductCategoryBadge product={product} />
                    </TableCell>
                    <TableCell>
                      <ProductStatusBadge product={product} />
                    </TableCell>
                    <TableCell className="font-bold">{formatPriceRange(product.prices)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <ProductTypeBadge type={product.type} />
                        <p className="text-muted-foreground mt-1 text-xs">
                          {product.variantsCount} вариантов
                        </p>
                        {product.type === "PIZZA" && (
                          <p className="text-muted-foreground text-xs">
                            {product.ingredientsCount} ингредиентов
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground pr-5">
                      {new Date(product.updatedAt).toLocaleDateString("ru-RU")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="divide-y lg:hidden">
            {filteredProducts.map((product) => (
              <article key={product.id} className="p-4">
                <div className="flex gap-3">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-orange-50">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    ) : (
                      <ImageIcon className="text-muted-foreground absolute inset-0 m-auto size-6" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/dashboard/products/${product.id}`}
                      className="hover:text-primary block leading-snug font-extrabold transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-muted-foreground mt-1 text-xs">ID #{product.id}</p>
                    <p className="mt-2 font-extrabold">{formatPriceRange(product.prices)}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ProductStatusBadge product={product} />
                  <ProductCategoryBadge product={product} />
                  <ProductTypeBadge type={product.type} />
                </div>
                <div className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs">
                  <span>{product.variantsCount} вариантов</span>
                  {product.type === "PIZZA" && <span>{product.ingredientsCount} ингредиентов</span>}
                  <span className="ml-auto">{new Date(product.updatedAt).toLocaleDateString("ru-RU")}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="flex min-h-72 flex-col items-center justify-center px-5 text-center">
          <span className="bg-muted flex size-14 items-center justify-center rounded-2xl">
            {products.length ? (
              <PackageSearch className="text-muted-foreground size-6" />
            ) : (
              <Boxes className="text-muted-foreground size-6" />
            )}
          </span>
          <h3 className="mt-4 font-extrabold">
            {products.length ? "Товары не найдены" : "Товаров пока нет"}
          </h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            {products.length
              ? "Измените поисковый запрос или выбранные фильтры."
              : "Созданные товары появятся в этом списке."}
          </p>
        </div>
      )}
    </section>
  );
}
