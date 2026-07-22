"use client";
import { FormProvider, useForm } from "react-hook-form";
import { Container } from "./container";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserFormTypes, updateUserFormSchema } from "./modals/auth-modal/forms/schemas";
import type { User } from "@/src/generated/prisma/client";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Title } from "./title";
import { FormInput } from "./form-components";
import { Button } from "../ui";
import { updateUserInfo } from "@/app/(root)/profile/actions";

interface ProfileFormProps {
  data: User;
}

export function ProfileForm({ data }: ProfileFormProps) {
  const form = useForm({
    resolver: zodResolver(updateUserFormSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UpdateUserFormTypes) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });
      toast.success("Данные успешно обновлены", { icon: "✅" });
    } catch (error) {
      return toast.error("Ошибка при обновлении данных", { icon: "❌" });
    }
  };

  const onClickSignOut = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  return (
    <Container className="mx-0 my-10 flex-1">
      <Title text="Личные данные" size="md" className="font-bold" />

      <FormProvider {...form}>
        <form className="mt-10 flex w-96 flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
          <FormInput name="email" label="E-mail" required />
          <FormInput name="fullName" label="Полное имя" required />

          <FormInput type="password" name="password" label="Новый пароль" />
          <FormInput type="password" name="confirmPassword" label="Повторите пароль" />

          <Button disabled={form.formState.isSubmitting} type="submit" className="mt-10 text-base">
            Сохранить
          </Button>

          <Button
            onClick={onClickSignOut}
            variant={"secondary"}
            disabled={form.formState.isSubmitting}
            className="text-base"
            type="button"
          >
            Выйти
          </Button>
        </form>
      </FormProvider>
    </Container>
  );
}
