"use client";

import { createIngredient, type IngredientInput } from "@/app/(dashboard)/dashboard/ingredients/actions";
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
  Input,
} from "@/shared/components/ui";
import { ImageIcon, Leaf, LoaderCircle, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import toast from "react-hot-toast";

const INITIAL_VALUES: IngredientInput = { name: "", price: 0, imageUrl: "" };

export function CreateIngredientDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(INITIAL_VALUES);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const ingredient = await createIngredient(values);
        toast.success("Ингредиент создан");
        setOpen(false);
        setValues(INITIAL_VALUES);
        router.push(`/dashboard/ingredients/${ingredient.id}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось создать ингредиент");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!isPending) {
          setOpen(next);
          if (!next) setValues(INITIAL_VALUES);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="relative z-10 bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-600"
        >
          <Plus /> Новый ингредиент
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Leaf className="size-5" />
            </div>
            <DialogTitle>Новый ингредиент</DialogTitle>
            <DialogDescription>
              Добавьте ингредиент в общую библиотеку. После создания его можно назначить любым пиццам.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 grid gap-5 sm:grid-cols-[120px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-emerald-50">
              {values.imageUrl.startsWith("/") ? (
                <Image
                  src={values.imageUrl}
                  alt={values.name || "Новый ингредиент"}
                  fill
                  sizes="120px"
                  className="object-contain p-3"
                />
              ) : (
                <ImageIcon className="text-muted-foreground absolute inset-0 m-auto size-7" />
              )}
            </div>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-bold">Название</span>
                <Input
                  autoFocus
                  required
                  maxLength={80}
                  value={values.name}
                  onChange={(event) => setValues({ ...values, name: event.target.value })}
                  placeholder="Например, халапеньо"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold">Стоимость, ₽</span>
                <Input
                  required
                  type="number"
                  min={0}
                  max={100000}
                  step={1}
                  value={values.price}
                  onChange={(event) => setValues({ ...values, price: Number(event.target.value) })}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-bold">Изображение</span>
                <Input
                  required
                  value={values.imageUrl}
                  onChange={(event) => setValues({ ...values, imageUrl: event.target.value })}
                  placeholder="/ingredients/12.png"
                />
              </label>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Отмена
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={values.name.trim().length < 2 || !values.imageUrl.startsWith("/") || isPending}
            >
              {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
              {isPending ? "Создание…" : "Создать"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
