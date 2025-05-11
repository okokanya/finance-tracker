import { z } from 'zod';

import texts from '@/features/profile/profile.texts';

export const userSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(2, texts.firstNameMinLength).max(30, texts.firstNameMaxLength),
  lastName: z.string().min(2, texts.lastNameMinLength).max(30, texts.lastNameMaxLength),
  email: z.string().email(texts.wrongEmail),
  password: z.string().min(8, texts.passwordMinLength),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-()]+$/, texts.wrongPhoneNumber)
    .nullable(),
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
