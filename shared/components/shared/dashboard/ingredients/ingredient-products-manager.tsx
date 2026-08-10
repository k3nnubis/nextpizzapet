"use client";

import {
  attachIngredientToProduct,
  detachIngredientFromProduct,
} from "@/app/(dashboard)/dashboard/ingredients/actions";
import { Button } from "@/shared/components/ui";
import { Badge } from "@/shared/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Link2, LoaderCircle, PackagePlus, Unlink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import type { IngredientProduct } from "./ingredient-types";

export function IngredientProductsManager({
  ingredientId,
  products,
  availableProducts,
}: {
  ingredientId: number;
  products: IngredientProduct[];
  availableProducts: IngredientProduct[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(availableProducts[0]?.id ? String(availableProducts[0].id) : "");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>, productId: number, success: string) {
    setBusyId(productId);
    startTransition(async () => {
      try {
        await action();
        toast.success(success);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось обновить связь");
      } finally {
        setBusyId(null);
      }
    });
  }

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <Link2 className="size-5" />
          </span>
          <div>
            <h2 className="font-extrabold">Используется в продуктах</h2>
            <p className="text-muted-foreground text-sm">
              {products.length
                ? `${products.length} продуктов в меню`
                : "Пока не назначен ни одному продукту"}
            </p>
          </div>
        </div>
        {availableProducts.length > 0 && (
          <div className="flex gap-2">
            <Select value={selected} onValueChange={setSelected} disabled={isPending}>
              <SelectTrigger className="h-10 min-w-0 flex-1 sm:w-64" aria-label="Выберите пиццу">
                <SelectValue placeholder="Выберите пиццу" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={!selected || isPending}
              onClick={() => {
                const id = Number(selected);
                run(() => attachIngredientToProduct(ingredientId, id), id, "Ингредиент добавлен в пиццу");
              }}
            >
              <PackagePlus /> <span className="hidden sm:inline">Добавить</span>
            </Button>
          </div>
        )}
      </div>
      {products.length ? (
        <div className="divide-y">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 p-4 sm:px-5">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-orange-50">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/dashboard/products/${product.id}`}
                  className="truncate font-extrabold hover:text-orange-600"
                >
                  {product.name}
                </Link>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={
                      product.status === "ACTIVE"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-800"
                    }
                  >
                    {product.status === "ACTIVE" ? "Активен" : "Заблокирован"}
                  </Badge>
                  <span className="text-muted-foreground text-xs leading-6">
                    {product.category?.name ?? "Без категории"}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  run(
                    () => detachIngredientFromProduct(ingredientId, product.id),
                    product.id,
                    "Ингредиент убран из пиццы",
                  )
                }
              >
                {busyId === product.id ? <LoaderCircle className="animate-spin" /> : <Unlink />}
                <span className="hidden sm:inline">Убрать</span>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="font-bold">Связей пока нет</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Выберите пиццу выше, чтобы добавить ингредиент в её состав.
          </p>
        </div>
      )}
    </section>
  );
}
