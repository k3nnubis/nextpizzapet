import { z } from "zod";

const passwordSchema = z.string().min(6, "Пароль должен содержать не менее 6 символов");

export const signInFormSchema = z.object({
  email: z.email("Введите корректный адрес e-mail"),
  password: passwordSchema,
});

export const signUpFormSchema = signInFormSchema
  .extend({
    fullName: z.string().min(4, "Введите имя и фамилию"),
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type SignInFormTypes = z.infer<typeof signInFormSchema>;
export type SignUpFormTypes = z.infer<typeof signUpFormSchema>;
