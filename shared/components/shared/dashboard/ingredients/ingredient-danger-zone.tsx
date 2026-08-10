"use client";

import { deleteIngredient } from "@/app/(dashboard)/dashboard/ingredients/actions";
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

export function IngredientDangerZone({
  ingredientId,
  name,
  productsCount,
  cartsCount,
}: {
  ingredientId: number;
  name: string;
  productsCount: number;
  cartsCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteIngredient(ingredientId);
        toast.success(`Ингредиент «${name}» удалён`);
        router.replace("/dashboard/ingredients");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось удалить ингредиент");
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
            <h2 className="font-extrabold text-red-950">Глобальное удаление</h2>
            <p className="mt-1 max-w-2xl text-sm text-red-800/80">
              Ингредиент исчезнет из {productsCount} продуктов и {cartsCount} активных позиций корзин.
              Стоимость корзин будет пересчитана.
            </p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={(value) => !isPending && setOpen(value)}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 /> Удалить ингредиент
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Удалить «{name}» безвозвратно?</DialogTitle>
              <DialogDescription>
                Это действие нельзя отменить. Все связи ингредиента с продуктами и корзинами будут удалены.
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
                {isPending ? "Удаление…" : "Удалить глобально"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
