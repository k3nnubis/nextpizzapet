"use client";

import { deleteCategory } from "@/app/(dashboard)/dashboard/categories/actions";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui";
import { LoaderCircle, Trash2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface CategoryDangerZoneProps {
  categoryId: number;
  categoryName: string;
  productsCount: number;
}

export function CategoryDangerZone({ categoryId, categoryName, productsCount }: CategoryDangerZoneProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(nextOpen: boolean) {
    if (!isPending) setOpen(nextOpen);
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteCategory(categoryId);
        toast.success(`Категория «${categoryName}» удалена`);
        setOpen(false);
        router.replace("/dashboard/categories");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось удалить категорию");
      }
    });
  }

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">
            <TriangleAlert className="size-5" />
          </span>
          <div>
            <h2 className="font-extrabold text-red-950">Удаление категории</h2>
            <p className="mt-1 max-w-2xl text-sm text-red-800/80">
              Категория исчезнет из каталога. Её товары сохранятся, но останутся без категории и будут
              заблокированы.
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="shrink-0">
              <Trash2 /> Удалить категорию
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <TriangleAlert className="size-5" />
              </div>
              <DialogTitle>Удалить категорию «{categoryName}»?</DialogTitle>
              <DialogDescription>
                Это действие нельзя отменить.{" "}
                {productsCount > 0
                  ? `${productsCount} товаров будут отвязаны, заблокированы и удалены из активных корзин.`
                  : "В категории нет товаров."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>
                  Отмена
                </Button>
              </DialogClose>
              <Button variant="destructive" disabled={isPending} onClick={handleDelete}>
                {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
                {isPending ? "Удаление…" : "Удалить безвозвратно"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
