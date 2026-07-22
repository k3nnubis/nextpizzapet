"use client";
import { FormProvider, useForm } from "react-hook-form";
import { signUpFormSchema, SignUpFormTypes } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Title } from "../../../title";
import { FormInput } from "../../../form-components";
import { Button, Skeleton } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { registerUser } from "@/app/(root)/profile/actions";
interface SignUpProps {
  onClose?: VoidFunction;
}
export function SignUp({ onClose }: SignUpProps) {
  const form = useForm<SignUpFormTypes>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: SignUpFormTypes) => {
    try {
      await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });
      toast.success("Регистрация успешна, подтвердите свою почту", { icon: "✅" });
      onClose?.();
    } catch (error) {
      console.log("Error [REGISTER]: ", error);
      return toast.error("Неверный E-mail или пароль", { icon: "❌" });
    }
  };
  return (
    <FormProvider {...form}>
      <form className="flex w-full flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center justify-between gap-3">
          <Title text="Регистрация" size="lg" className="font-bold" />
        </div>
        <FormInput name="fullName" label="Полное имя" required />
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <FormInput name="confirmPassword" label="Повторите пароль" type="password" required />
        <Button
          disabled={!form.formState.isValid || form.formState.isSubmitting}
          className={cn("h-12 text-base", {
            "pointer-events-none": !form.formState.isValid || form.formState.isSubmitting,
          })}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <Skeleton className="h-4 w-12 rounded-sm bg-white/40" />
          ) : (
            "Регистрация"
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
