import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(2, "Имя должно содержать минимум 2 буквы"),
  lastName: z.string().min(2, "Фамилия должна содержать минимум 2 буквы"),
  email: z.string().email("Некорректный email"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Некорректный номер телефона"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

export type User = z.infer<typeof userSchema>;
