"use client";

import { updateIngredient, type IngredientInput } from "@/app/(dashboard)/dashboard/ingredients/actions";
import { Button, Input } from "@/shared/components/ui";
import { Check, ImageIcon, LoaderCircle, PencilLine, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";

export function IngredientInfoForm({
  ingredientId,
  initialValues,
}: {
  ingredientId: number;
  initialValues: IngredientInput;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();
  const hasChanges = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [initialValues, values],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        await updateIngredient(ingredientId, values);
        toast.success("Ингредиент сохранён, цены корзин пересчитаны");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось сохранить ингредиент");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <PencilLine className="size-5" />
        </span>
        <div>
          <h2 className="font-extrabold">Карточка ингредиента</h2>
          <p className="text-muted-foreground text-sm">
            Название, стоимость добавки и изображение в каталоге.
          </p>
        </div>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[200px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-3xl border bg-emerald-50">
          {values.imageUrl.startsWith("/") ? (
            <Image
              src={values.imageUrl}
              alt={values.name}
              fill
              sizes="200px"
              className="object-contain p-4"
            />
          ) : (
            <ImageIcon className="text-muted-foreground absolute inset-0 m-auto size-9" />
          )}
        </div>
        <div className="grid content-start gap-5 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold">Название</span>
            <Input
              required
              maxLength={80}
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
              className="h-11"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold">Стоимость, ₽</span>
            <Input
              required
              type="number"
              min={0}
              max={100000}
              step={1}
              value={values.price}
              onChange={(event) => setValues({ ...values, price: Number(event.target.value) })}
              className="h-11"
            />
            <span className="text-muted-foreground block text-xs">
              При изменении активные корзины обновятся автоматически.
            </span>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-bold">Путь к изображению</span>
            <Input
              required
              value={values.imageUrl}
              onChange={(event) => setValues({ ...values, imageUrl: event.target.value })}
              placeholder="/ingredients/example.png"
              className="h-11"
            />
            <span className="text-muted-foreground block text-xs">
              Файл должен находиться в папке public.
            </span>
          </label>
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2 border-t p-5">
        <Button
          type="button"
          variant="outline"
          disabled={!hasChanges || isPending}
          onClick={() => setValues(initialValues)}
        >
          <RotateCcw /> Сбросить
        </Button>
        <Button type="submit" disabled={!hasChanges || isPending}>
          {isPending ? <LoaderCircle className="animate-spin" /> : <Check />}
          {isPending ? "Сохранение…" : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}
