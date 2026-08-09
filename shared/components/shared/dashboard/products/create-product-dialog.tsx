"use client";

import { createProduct, type CreateProductInput } from "@/app/(dashboard)/dashboard/products/actions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ImageIcon, LoaderCircle, PackagePlus, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import toast from "react-hot-toast";
import type { DashboardProductCategory } from "./product-types";

interface CreateProductDialogProps {
  categories: DashboardProductCategory[];
}

const WITHOUT_CATEGORY = "WITHOUT_CATEGORY";
const INITIAL_VALUES: CreateProductInput = {
  name: "",
  imageUrl: "",
  categoryId: null,
  type: "SIMPLE",
};

export function CreateProductDialog({ categories }: CreateProductDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<CreateProductInput>(INITIAL_VALUES);
  const [isPending, startTransition] = useTransition();

  function updateValue<Key extends keyof CreateProductInput>(key: Key, value: CreateProductInput[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;
    setOpen(nextOpen);
    if (!nextOpen) setValues(INITIAL_VALUES);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const product = await createProduct(values);
        toast.success("Товар создан как черновик");
        setOpen(false);
        setValues(INITIAL_VALUES);
        router.push(`/dashboard/products/${product.id}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось создать товар");
      }
    });
  }

  const canSubmit = values.name.trim().length >= 2 && values.imageUrl.trim().startsWith("/") && !isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="relative z-10 bg-orange-500 text-white shadow-lg shadow-orange-950/20 hover:bg-orange-600"
        >
          <Plus /> Новый товар
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <PackagePlus className="size-5" />
            </div>
            <DialogTitle>Создание товара</DialogTitle>
            <DialogDescription>
              Товар будет создан как заблокированный черновик. Затем добавьте цену или варианты и опубликуйте
              его.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-4 sm:grid-cols-[110px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-2xl border bg-orange-50">
              {values.imageUrl.startsWith("/") ? (
                <Image
                  src={values.imageUrl}
                  alt={values.name || "Новый товар"}
                  fill
                  sizes="110px"
                  className="object-contain p-2"
                />
              ) : (
                <ImageIcon className="text-muted-foreground absolute inset-0 m-auto size-7" />
              )}
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-bold">Название</span>
                <Input
                  value={values.name}
                  onChange={(event) => updateValue("name", event.target.value)}
                  placeholder="Например, Маргарита"
                  maxLength={120}
                  autoFocus
                  required
                  disabled={isPending}
                  className="h-11"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold">Путь к изображению</span>
                <Input
                  value={values.imageUrl}
                  onChange={(event) => updateValue("imageUrl", event.target.value)}
                  placeholder="/products/margherita.avif"
                  required
                  disabled={isPending}
                  className="h-11"
                />
              </label>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold">Тип товара</span>
              <Select
                value={values.type}
                onValueChange={(value) => updateValue("type", value as CreateProductInput["type"])}
                disabled={isPending}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIMPLE">Обычный товар</SelectItem>
                  <SelectItem value="PIZZA">Пицца</SelectItem>
                </SelectContent>
              </Select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold">Категория</span>
              <Select
                value={values.categoryId === null ? WITHOUT_CATEGORY : String(values.categoryId)}
                onValueChange={(value) =>
                  updateValue("categoryId", value === WITHOUT_CATEGORY ? null : Number(value))
                }
                disabled={isPending}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WITHOUT_CATEGORY}>Без категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
              {isPending ? "Создание…" : "Создать товар"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
