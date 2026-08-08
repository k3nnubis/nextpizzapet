import { z } from "zod";

export const editUserFormSchema = z.object({
  fullName: z.string().trim().min(2, "Введите имя и фамилию"),
  email: z.email("Введите корректный адрес e-mail"),
  role: z.enum(["USER", "ADMIN"]),
  status: z.enum(["ACTIVE", "BLOCKED"]),
  verified: z.boolean(),
});

export const resetPasswordFormSchema = z
  .object({
    password: z.string().min(8, "Минимум 8 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type EditUserFormValues = z.infer<typeof editUserFormSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;
