"use client";

import { editUserInfo } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/shared/components/ui";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormInput } from "../../../form-components";
import { editUserFormSchema, EditUserFormValues } from "./schemas";

interface EditUserFormProps {
  userId: number;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  verified: boolean;
  isCurrentUser: boolean;
}

export const EditUserForm = (props: EditUserFormProps) => {
  const router = useRouter();
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      fullName: props.fullName,
      email: props.email,
      role: props.role,
      status: props.status,
      verified: props.verified,
    },
  });
  const { isDirty, isSubmitting } = form.formState;

  useEffect(() => {
    const warnAboutUnsavedChanges = (event: BeforeUnloadEvent) => {
      if (!form.formState.isDirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warnAboutUnsavedChanges);
    return () => window.removeEventListener("beforeunload", warnAboutUnsavedChanges);
  }, [form.formState.isDirty]);

  const onSubmit = async (data: EditUserFormValues) => {
    try {
      await editUserInfo(data, props.userId);
      form.reset(data);
      toast.success("Данные пользователя сохранены");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось сохранить пользователя");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput name="fullName" label="Имя и фамилия" required autoComplete="name" />
          <FormInput name="email" label="E-mail" required type="email" autoComplete="email" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <label className="space-y-2 font-medium">
                <span>Роль</span>
                <Select value={field.value} onValueChange={field.onChange} disabled={props.isCurrentUser}>
                  <SelectTrigger className="h-12 w-full bg-white">
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
              <label className="space-y-2 font-medium">
                <span>Статус</span>
                <Select value={field.value} onValueChange={field.onChange} disabled={props.isCurrentUser}>
                  <SelectTrigger className="h-12 w-full bg-white">
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
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4">
              <Checkbox
                className="rounded-[5px]"
                checked={field.value}
                onCheckedChange={(value) => field.onChange(value === true)}
              />
              <span>
                <span className="block font-semibold">E-mail подтверждён</span>
                <span className="text-muted-foreground text-sm">
                  При изменении адреса подтверждение автоматически сбросится.
                </span>
              </span>
            </label>
          )}
        />

        <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || isSubmitting}
            onClick={() => form.reset()}
          >
            Отмена
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting && <LoaderCircle className="animate-spin" />}
            {isSubmitting ? "Сохранение…" : "Сохранить изменения"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
