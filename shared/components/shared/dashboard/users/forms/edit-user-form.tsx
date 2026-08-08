"use client";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "../../../form-components";
import { editUserFormSchema, EditUserFormValues } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { editUserInfo } from "@/app/(dashboard)/dashboard/actions";
import { Button } from "@/shared/components/ui";

interface EditUserFormProps {
  userId: number;
  fullName: string;
  email: string;
}

export const EditUserForm = ({ fullName, email, userId }: EditUserFormProps) => {
  const router = useRouter();
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      fullName: fullName,
      email: email,
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: EditUserFormValues) => {
    try {
      await editUserInfo(data, userId);
      toast.success("Пользователь успешно обновлен");
    } catch (error) {
      console.log("Error [EDIT_USER]:", error);
      toast.error("Произошла ошибка при редактировании пользователя");
    } finally {
      router.refresh();
    }
  };
  return (
    <div className="bg-accent w-[760px] rounded-2xl p-5">
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-lg bg-white p-3 shadow-md"
        >
          <FormInput name="fullName" label="Имя" />
          <FormInput name="email" label="E-Mail" />
          <FormInput name="password" label="Пароль" />
          <FormInput name="confirmPassword" label="Повторите пароль" />
          <Button className="mt-3" size="sm" type="submit">
            Сохранить
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
