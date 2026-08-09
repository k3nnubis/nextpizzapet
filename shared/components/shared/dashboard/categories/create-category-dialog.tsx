"use client";

import { createCategory } from "@/app/(dashboard)/dashboard/categories/actions";
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
import { FolderPlus, LoaderCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import toast from "react-hot-toast";

export function CreateCategoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const normalizedName = name.trim();

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) return;

    setOpen(nextOpen);
    if (!nextOpen) setName("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      try {
        const category = await createCategory(name);
        toast.success("Категория создана");
        setOpen(false);
        setName("");
        router.push(`/dashboard/categories/${category.id}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Не удалось создать категорию");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="relative z-10 bg-orange-500 text-white shadow-lg shadow-orange-950/20 hover:bg-orange-600"
        >
          <Plus /> Новая категория
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <FolderPlus className="size-5" />
            </div>
            <DialogTitle>Создание категории</DialogTitle>
            <DialogDescription>
              Укажите название нового раздела каталога. Товары можно будет добавить позже.
            </DialogDescription>
          </DialogHeader>

          <label className="mt-5 block space-y-2">
            <span className="text-sm font-bold">Название</span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Например, Десерты"
              aria-label="Название новой категории"
              maxLength={80}
              autoFocus
              required
              disabled={isPending}
              className="h-11"
            />
            <span className="text-muted-foreground block text-xs">От 2 до 80 символов</span>
          </label>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" disabled={normalizedName.length < 2 || isPending}>
              {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
              {isPending ? "Создание…" : "Создать категорию"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
