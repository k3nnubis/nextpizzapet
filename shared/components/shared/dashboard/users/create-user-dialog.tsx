"use client";

import { createDashboardUser } from "@/app/(dashboard)/dashboard/actions";
import { ErrorText } from "@/shared/components/shared/form-components";
import {
  Button,
  Checkbox,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createUserFormSchema, type CreateUserFormValues } from "./forms/schemas";

const DEFAULT_VALUES: CreateUserFormValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "USER",
  status: "ACTIVE",
  verified: false,
};

export function CreateUserDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const { errors, isSubmitting } = form.formState;

  function resetForm() {
    form.reset(DEFAULT_VALUES);
    setShowPassword(false);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) return;
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  }

  async function handleSubmit(data: CreateUserFormValues) {
    try {
      const user = await createDashboardUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status,
        verified: data.verified,
      });
      toast.success("Пользователь создан");
      setOpen(false);
      resetForm();
      router.push(`/dashboard/users/${user.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось создать пользователя");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="relative z-10 bg-orange-500 text-white shadow-lg shadow-orange-950/20 hover:bg-orange-600"
        >
          <Plus /> Новый пользователь
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <DialogHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <UserPlus className="size-5" />
            </div>
            <DialogTitle>Создание пользователя</DialogTitle>
            <DialogDescription>
              Создайте учётную запись и задайте её начальные права доступа.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-bold">Имя и фамилия</span>
              <Input
                {...form.register("fullName")}
                placeholder="Иван Иванов"
                autoComplete="name"
                maxLength={100}
                autoFocus
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.fullName)}
                className="h-11"
              />
              {errors.fullName?.message && <ErrorText text={errors.fullName.message} />}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold">E-mail</span>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="user@example.com"
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                className="h-11"
              />
              {errors.email?.message && <ErrorText text={errors.email.message} />}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold">Временный пароль</span>
              <span className="relative block">
                <Input
                  {...form.register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.password)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </span>
              {errors.password?.message && <ErrorText text={errors.password.message} />}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-bold">Повторите пароль</span>
              <Input
                {...form.register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.confirmPassword)}
                className="h-11"
              />
              {errors.confirmPassword?.message && <ErrorText text={errors.confirmPassword.message} />}
            </label>

            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <label className="space-y-2">
                  <span className="text-sm font-bold">Роль</span>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">Пользователь</SelectItem>
                      <SelectItem value="ADMIN">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              )}
            />

            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <label className="space-y-2">
                  <span className="text-sm font-bold">Статус</span>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Активен</SelectItem>
                      <SelectItem value="BLOCKED">Заблокирован</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="verified"
            render={({ field }) => (
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border bg-gray-50 p-4">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  disabled={isSubmitting}
                  className="mt-0.5 rounded-[5px]"
                />
                <span>
                  <span className="block text-sm font-bold">Считать e-mail подтверждённым</span>
                  <span className="text-muted-foreground mt-0.5 block text-xs">
                    Пользователю не потребуется проходить подтверждение адреса.
                  </span>
                </span>
              </label>
            )}
          />

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Отмена
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <LoaderCircle className="animate-spin" /> : <UserPlus />}
              {isSubmitting ? "Создание…" : "Создать пользователя"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
