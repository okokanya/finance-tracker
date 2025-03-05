import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 буквы')
    .max(30, 'Имя не должно превышать 30 символов'),
  lastName: z
    .string()
    .min(2, 'Фамилия должна содержать минимум 2 буквы')
    .max(30, 'Фамилия не должна превышать 30 символов'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  phone: z.string().nullable(),
  avatar: z.instanceof(Buffer).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;

// модель пользователя для создания
export const createUserSchema = userSchema.omit({
  createdAt: true,
  updatedAt: true,
  avatar: true,
  id: true,
  phone: true,
});

export type CreateUser = z.infer<typeof createUserSchema>;
