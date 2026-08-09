import { Badge } from "@/shared/components/ui/badge";
import { ArrowUpRight, ImageIcon, PackageOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { DashboardCategory } from "./category-types";

interface CategoryCardProps {
  category: DashboardCategory;
}

function productWord(count: number) {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return "товаров";
  if (lastDigit === 1) return "товар";
  if (lastDigit >= 2 && lastDigit <= 4) return "товара";
  return "товаров";
}

export function CategoryCard({ category }: CategoryCardProps) {
  const categoryHref = `/dashboard/categories/${category.id}`;

  return (
    <article className="group relative flex min-h-80 flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60">
      <Link
        href={categoryHref}
        className="absolute inset-0 z-10"
        aria-label={`Открыть категорию «${category.name}»`}
      />

      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
        {category.products.length ? (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-px bg-white/80">
            {category.products.map((product, index) => (
              <div
                key={product.id}
                className={`relative overflow-hidden bg-orange-50 ${
                  category.products.length === 1
                    ? "col-span-3 row-span-2"
                    : index === 0
                      ? "col-span-2 row-span-2"
                      : category.products.length === 2
                        ? "row-span-2"
                        : ""
                }`}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-white/80 text-orange-300 shadow-sm">
              <ImageIcon className="size-7" />
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/90 to-transparent" />
        <Badge className="absolute top-4 left-4 border-0 bg-white/90 text-gray-800 shadow-sm backdrop-blur-sm hover:bg-white/90">
          #{category.id}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-extrabold transition-colors group-hover:text-orange-600">
              {category.name}
            </h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
              <PackageOpen className="size-4" />
              {category.productsCount.toLocaleString("ru-RU")} {productWord(category.productsCount)}
            </p>
          </div>
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all group-hover:bg-orange-500 group-hover:text-white">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="mt-auto border-t pt-4">
          <p className="text-muted-foreground text-xs">
            Обновлено{" "}
            {new Date(category.updatedAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </article>
  );
}
