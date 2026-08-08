"use client";

import { resetUserPassword, sendUserPasswordResetLink } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/shared/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Eye, EyeOff, LoaderCircle, Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FormInput } from "../../../form-components";
import { resetPasswordFormSchema, ResetPasswordFormValues } from "./schemas";

const generatePassword = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint32Array(16));
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
};

export function UserSecurityForm({ userId }: { userId: number }) {
  const [showPassword, setShowPassword] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const createPassword = () => {
    const password = generatePassword();
    form.setValue("password", password, { shouldDirty: true, shouldValidate: true });
    form.setValue("confirmPassword", password, { shouldDirty: true, shouldValidate: true });
    setShowPassword(true);
  };

  const copyPassword = async () => {
    const password = form.getValues("password");
    if (!password) return;
    await navigator.clipboard.writeText(password);
    toast.success("Пароль скопирован");
  };

  const onSubmit = async ({ password }: ResetPasswordFormValues) => {
    try {
      await resetUserPassword(password, userId);
      form.reset();
      setShowPassword(false);
      toast.success("Пароль изменён, активные сессии отозваны");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось изменить пароль");
    }
  };

  const sendResetLink = async () => {
    setSendingLink(true);
    try {
      await sendUserPasswordResetLink(userId);
      toast.success("Ссылка для сброса отправлена на e-mail пользователя");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Не удалось отправить письмо");
    } finally {
      setSendingLink(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <p className="text-muted-foreground text-sm">
          Задайте временный пароль вручную или сгенерируйте безопасный. После сохранения все текущие сессии пользователя завершатся.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormInput name="password" label="Новый пароль" type={showPassword ? "text" : "password"} autoComplete="new-password" />
          <FormInput
            name="confirmPassword"
            label="Повторите пароль"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={createPassword}>
            <RefreshCw /> Сгенерировать
          </Button>
          <Button type="button" variant="outline" onClick={copyPassword} disabled={!form.watch("password")}>
            <Copy /> Скопировать
          </Button>
          <Button type="button" variant="ghost" onClick={() => setShowPassword((value) => !value)}>
            {showPassword ? <EyeOff /> : <Eye />} {showPassword ? "Скрыть" : "Показать"}
          </Button>
          <Button type="button" variant="outline" disabled={sendingLink} onClick={sendResetLink}>
            {sendingLink ? <LoaderCircle className="animate-spin" /> : <Mail />} Отправить ссылку
          </Button>
          <Button className="sm:ml-auto" type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}>
            {form.formState.isSubmitting && <LoaderCircle className="animate-spin" />}
            Обновить пароль
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
