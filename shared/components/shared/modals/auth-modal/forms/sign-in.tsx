"use client";
import { FormProvider, useForm } from "react-hook-form";
import { signInFormSchema, SignInFormTypes } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "../../../title";
import { FormInput } from "../../../form-components";
import { Button, Skeleton } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface SignInProps {
  onClose?: VoidFunction;
}

export function SignIn({ onClose }: SignInProps) {
  const form = useForm<SignInFormTypes>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: SignInFormTypes) => {
    try {
      const response = await signIn("credentials", { ...data, redirect: false });
      if (!response?.ok) {
        return toast.error("Не удалось войти в аккаунт", { icon: "❌" });
      }
      toast.success("Вы успешно вошли в аккаунт", { icon: "✅" });
      onClose?.();
    } catch (error) {
      console.log("Error [LOGIN]: ", error);
      toast.error("Не удалось войти в аккаунт", { icon: "❌" });
    }
  };
  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center justify-between gap-3">
          <Title text="Вход в аккаунт" size="lg" className="font-bold" />
          <p className="text-gray-400">Введите свою почту, чтобы войти в свой аккаунт</p>
        </div>
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className={cn("h-12 text-base", {
            "pointer-events-none": !form.formState.isValid || form.formState.isSubmitting,
          })}
          type="submit"
        >
          {form.formState.isSubmitting ? <Skeleton className="h-4 w-12 rounded-sm bg-white/40" /> : "Войти"}
        </Button>
      </form>
    </FormProvider>
  );
}
