"use client";

import {
  createPizzaVariant,
  createSimpleVariant,
  deleteProductVariant,
  updateProductVariantPrice,
} from "@/app/(dashboard)/dashboard/products/actions";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "@/shared/components/ui";
import { Badge } from "@/shared/components/ui/badge";
import { CirclePlus, LoaderCircle, Save, Trash2, Vegan } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import toast from "react-hot-toast";
import type { DashboardProductVariant } from "./product-detail-types";

interface ProductVariantsEditorProps {
  productId: number;
  productType: "SIMPLE" | "PIZZA";
  variants: DashboardProductVariant[];
}

const PIZZA_TYPES = [
  { value: 1 as const, label: "Традиционное тесто" },
  { value: 2 as const, label: "Тонкое тесто" },
];
const PIZZA_SIZES = [20, 30, 40] as const;

function variantKey(pizzaType: number | null, size: number | null) {
  return `${pizzaType ?? "simple"}-${size ?? "default"}`;
}

export function ProductVariantsEditor({ productId, productType, variants }: ProductVariantsEditorProps) {
  const router = useRouter();
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [variantToDelete, setVariantToDelete] = useState<DashboardProductVariant | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const nextPrices: Record<string, string> = {};
    variants.forEach((variant) => {
      nextPrices[variantKey(variant.pizzaType, variant.size)] = String(variant.price);
    });
    setPrices(nextPrices);
  }, [variants]);

  const variantsByKey = useMemo(
    () => new Map(variants.map((variant) => [variantKey(variant.pizzaType, variant.size), variant])),
    [variants],
  );

  function runAction(action: () => Promise<unknown>, successMessage: string) {
    startTransition(async () => {
      try {
        await action();
        toast.success(successMessage);
        setVariantToDelete(null);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось изменить вариант");
      }
    });
  }

  function readPrice(key: string) {
    const price = Number(prices[key]);
    if (!Number.isInteger(price) || price < 1) {
      toast.error("Укажите корректную цену целым числом");
      return null;
    }
    return price;
  }

  function renderVariantCard(
    key: string,
    title: string,
    variant: DashboardProductVariant | undefined,
    createAction: (price: number) => Promise<unknown>,
  ) {
    const price = prices[key] ?? "";
    const priceChanged = variant ? Number(price) !== variant.price : false;

    return (
      <article key={key} className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-extrabold">{title}</h3>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {variant ? `Вариант #${variant.id}` : "Вариант не создан"}
            </p>
          </div>
          <Badge
            variant="outline"
            className={
              variant ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-dashed text-gray-500"
            }
          >
            {variant ? "Создан" : "Отсутствует"}
          </Badge>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-xs font-bold">Цена, ₽</span>
          <Input
            type="number"
            min={1}
            max={1_000_000}
            step={1}
            value={price}
            onChange={(event) => setPrices((current) => ({ ...current, [key]: event.target.value }))}
            placeholder="499"
            disabled={isPending}
            className="h-10"
          />
        </label>

        <div className="mt-3 flex gap-2">
          {variant ? (
            <>
              <Button
                size="sm"
                className="flex-1"
                disabled={!priceChanged || isPending}
                onClick={() => {
                  const nextPrice = readPrice(key);
                  if (nextPrice)
                    runAction(
                      () => updateProductVariantPrice(productId, variant.id, nextPrice),
                      "Цена сохранена",
                    );
                }}
              >
                {isPending ? <LoaderCircle className="animate-spin" /> : <Save />} Сохранить
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                disabled={isPending}
                onClick={() => setVariantToDelete(variant)}
                aria-label={`Удалить ${title}`}
              >
                <Trash2 />
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="w-full"
              disabled={!price || isPending}
              onClick={() => {
                const nextPrice = readPrice(key);
                if (nextPrice) runAction(() => createAction(nextPrice), "Вариант создан");
              }}
            >
              {isPending ? <LoaderCircle className="animate-spin" /> : <CirclePlus />} Создать вариант
            </Button>
          )}
        </div>
      </article>
    );
  }

  const simpleKey = variantKey(null, null);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Варианты и цены</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {productType === "PIZZA"
              ? `Создано ${variants.length} из 6 возможных сочетаний.`
              : "У обычного товара может быть только один ценовой вариант."}
          </p>
        </div>
        {productType === "PIZZA" && <Badge variant="secondary">2 типа теста × 3 размера</Badge>}
      </div>

      {productType === "SIMPLE" ? (
        <div className="max-w-md">
          {renderVariantCard(
            simpleKey,
            "Основной вариант",
            variantsByKey.get(simpleKey) ?? variants[0],
            (price) => createSimpleVariant(productId, price),
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {PIZZA_TYPES.map((pizzaType) => (
            <div key={pizzaType.value}>
              <div className="mb-3 flex items-center gap-2">
                <Vegan className="size-4 text-orange-600" />
                <h3 className="font-extrabold">{pizzaType.label}</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {PIZZA_SIZES.map((size) => {
                  const key = variantKey(pizzaType.value, size);
                  return renderVariantCard(key, `${size} см`, variantsByKey.get(key), (price) =>
                    createPizzaVariant(productId, { price, pizzaType: pizzaType.value, size }),
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={variantToDelete !== null}
        onOpenChange={(open) => !isPending && !open && setVariantToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить вариант товара?</DialogTitle>
            <DialogDescription>
              Вариант исчезнет из выбора покупателей и будет удалён из активных корзин. Если это последний
              вариант, товар автоматически заблокируется.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Отмена
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={!variantToDelete || isPending}
              onClick={() =>
                variantToDelete &&
                runAction(() => deleteProductVariant(productId, variantToDelete.id), "Вариант удалён")
              }
            >
              {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
              {isPending ? "Удаление…" : "Удалить вариант"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
