import { z } from "zod";
const optionalPassword = z.string().optional();

export const editUserFormSchema = z
  .object({
    fullName: z.string().min(2, "Введите имя и фамилию"),
    email: z.email("Введите корректный адрес e-mail"),
    password: optionalPassword,
    confirmPassword: optionalPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;
