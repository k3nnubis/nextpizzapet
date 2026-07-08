import { z } from "zod";

export const checkoutFormSchema = z.object({
  firstName: z.string().min(1, "Имя должно содержать не менее 2-х символов"),
  lastName: z.string().min(1, "Фамилия должна содержать не менее 2-х символов"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  email: z.email("Введите корректный адрес e-mail"),
  address: z.string().min(5, "Введите корректный адремс"),
  comment: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
