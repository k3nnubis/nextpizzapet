"use client";

import { updateProductInfo, type UpdateProductInfoInput } from "@/app/(dashboard)/dashboard/products/actions";
import { Button, Input } from "@/shared/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Check, ImageIcon, LoaderCircle, PencilLine, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import type { DashboardProductCategory } from "./product-types";

interface ProductInfoFormProps {
  productId: number;
  initialValues: UpdateProductInfoInput;
  variantsCount: number;
  categories: DashboardProductCategory[];
}

const WITHOUT_CATEGORY = "WITHOUT_CATEGORY";

export function ProductInfoForm({
  productId,
  initialValues,
  variantsCount,
  categories,
}: ProductInfoFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [isPending, startTransition] = useTransition();
  const hasChanges = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(initialValues),
    [initialValues, values],
  );

  function updateValue<Key extends keyof UpdateProductInfoInput>(
    key: Key,
    value: UpdateProductInfoInput[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        await updateProductInfo(productId, values);
        toast.success("Данные товара сохранены");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось сохранить товар");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b p-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          <PencilLine className="size-5" />
        </span>
        <div>
          <h2 className="font-extrabold">Основная информация</h2>
          <p className="text-muted-foreground text-sm">
            Название, изображение, категория и публикация товара.
          </p>
        </div>
      </div>

      <div className="grid gap-6 p-5 lg:grid-cols-[180px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-orange-50">
          {values.imageUrl.startsWith("/") ? (
            <Image
              src={values.imageUrl}
              alt={values.name || "Изображение товара"}
              fill
              sizes="180px"
              className="object-contain p-3"
            />
          ) : (
            <ImageIcon className="text-muted-foreground absolute inset-0 m-auto size-8" />
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold">Название</span>
            <Input
              value={values.name}
              onChange={(event) => updateValue("name", event.target.value)}
              maxLength={120}
              required
              className="h-11"
            />
          </label>

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold">Путь к изображению</span>
            <Input
              value={values.imageUrl}
              onChange={(event) => updateValue("imageUrl", event.target.value)}
              placeholder="/products/example.avif"
              required
              className="h-11"
            />
            <span className="text-muted-foreground block text-xs">
              Файл должен находиться в папке public.
            </span>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold">Тип товара</span>
            <Select
              value={values.type}
              onValueChange={(value) => updateValue("type", value as UpdateProductInfoInput["type"])}
              disabled={variantsCount > 0}
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SIMPLE">Обычный товар</SelectItem>
                <SelectItem value="PIZZA">Пицца</SelectItem>
              </SelectContent>
            </Select>
            {variantsCount > 0 && (
              <span className="text-muted-foreground block text-xs">
                Удалите варианты, чтобы изменить тип.
              </span>
            )}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-bold">Категория</span>
            <Select
              value={values.categoryId === null ? WITHOUT_CATEGORY : String(values.categoryId)}
              onValueChange={(value) =>
                setValues((current) => ({
                  ...current,
                  categoryId: value === WITHOUT_CATEGORY ? null : Number(value),
                  ...(value === WITHOUT_CATEGORY ? { status: "BLOCKED" as const } : {}),
                }))
              }
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

          <label className="space-y-2 sm:col-span-2">
            <span className="text-sm font-bold">Статус</span>
            <Select
              value={values.status}
              onValueChange={(value) => updateValue("status", value as UpdateProductInfoInput["status"])}
            >
              <SelectTrigger className="h-11 w-full sm:max-w-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Доступен к заказу</SelectItem>
                <SelectItem value="BLOCKED">Заблокирован</SelectItem>
              </SelectContent>
            </Select>
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
