"use client";

import { updateCategoryName } from "@/app/(dashboard)/dashboard/categories/actions";
import { Button, Input } from "@/shared/components/ui";
import { Check, LoaderCircle, PencilLine, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import toast from "react-hot-toast";

interface CategoryNameFormProps {
  categoryId: number;
  initialName: string;
}

export function CategoryNameForm({ categoryId, initialName }: CategoryNameFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [isPending, startTransition] = useTransition();
  const normalizedName = name.trim();
  const hasChanges = normalizedName !== initialName;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        await updateCategoryName(categoryId, name);
        setName(normalizedName);
        toast.success("Название категории сохранено");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось сохранить категорию");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
          <PencilLine className="size-5" />
        </span>
        <div>
          <h2 className="font-extrabold">Основная информация</h2>
          <p className="text-muted-foreground text-sm">Название отображается в меню и на витрине.</p>
        </div>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-bold">Название категории</span>
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={80}
          required
          aria-label="Название категории"
          className="h-11"
        />
      </label>

      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          disabled={!hasChanges || isPending}
          onClick={() => setName(initialName)}
        >
          <RotateCcw /> Сбросить
        </Button>
        <Button type="submit" disabled={!hasChanges || normalizedName.length < 2 || isPending}>
          {isPending ? <LoaderCircle className="animate-spin" /> : <Check />}
          {isPending ? "Сохранение…" : "Сохранить"}
        </Button>
      </div>
    </form>
  );
}
