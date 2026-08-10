"use client";

import {
  removeProductFromCategory,
  setDashboardProductStatus,
} from "@/app/(dashboard)/dashboard/categories/actions";
import { Badge } from "@/shared/components/ui/badge";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui";
import { Ban, CircleCheck, LoaderCircle, PackageMinus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import type { DashboardCategoryProductDetails } from "./category-detail-types";

interface CategoryProductRowProps {
  categoryId: number;
  product: DashboardCategoryProductDetails;
}

function formatPriceRange(prices: number[]) {
  if (!prices.length) return "Цена не задана";

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (min === max) return `${min.toLocaleString("ru-RU")} ₽`;

  return `${min.toLocaleString("ru-RU")}–${max.toLocaleString("ru-RU")} ₽`;
}

export function CategoryProductRow({ categoryId, product }: CategoryProductRowProps) {
  const router = useRouter();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isActive = product.status === "ACTIVE";

  function handleStatusChange() {
    startTransition(async () => {
      try {
        await setDashboardProductStatus(categoryId, product.id, isActive ? "BLOCKED" : "ACTIVE");
        toast.success(isActive ? "Товар заблокирован" : "Товар снова доступен");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось изменить статус товара");
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      try {
        await removeProductFromCategory(categoryId, product.id);
        toast.success("Товар убран из категории и заблокирован");
        setRemoveDialogOpen(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось убрать товар");
      }
    });
  }

  return (
    <>
      <article className="flex flex-col gap-4 p-4 transition-colors hover:bg-gray-50/70 sm:flex-row sm:items-center">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-violet-50 sm:size-20">
          <Image src={product.imageUrl} alt={product.name} fill sizes="96px" className="object-contain p-2" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-extrabold">{product.name}</h3>
            <Badge
              variant="outline"
              className={
                isActive
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }
            >
              {isActive ? "Доступен" : "Заблокирован"}
            </Badge>
          </div>
          <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>ID #{product.id}</span>
            <span>{product.variantsCount} вариантов</span>
            <span className="font-bold text-gray-700">{formatPriceRange(product.prices)}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <Button
            variant={isActive ? "outline" : "secondary"}
            disabled={isPending}
            onClick={handleStatusChange}
            className={isActive ? "text-amber-700 hover:bg-amber-50 hover:text-amber-800" : ""}
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : isActive ? <Ban /> : <CircleCheck />}
            {isActive ? "Заблокировать" : "Разблокировать"}
          </Button>
          <Button
            variant="ghost"
            disabled={isPending}
            onClick={() => setRemoveDialogOpen(true)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <PackageMinus /> Убрать
          </Button>
        </div>
      </article>

      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Убрать товар из категории?</DialogTitle>
            <DialogDescription>
              «{product.name}» станет товаром без категории и будет автоматически заблокирован. Из базы данных
              товар не удалится.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Отмена
              </Button>
            </DialogClose>
            <Button variant="destructive" disabled={isPending} onClick={handleRemove}>
              {isPending ? <LoaderCircle className="animate-spin" /> : <PackageMinus />}
              {isPending ? "Удаление…" : "Убрать из категории"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
