import { z } from 'zod';

import { CATEGORY_TYPES } from '@/types/enums';

export const categoryTypeEnum = z.enum(CATEGORY_TYPES);

export const categorySchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z
    .string()
    .min(1, 'Название не может быть пустым')
    .max(30, 'Название не должно превышать 30 символов'),
  description: z
    .string()
    .max(200, 'Описание не должно превышать 200 символов')
    .transform(val => (val.trim() === '' ? null : val))
    .nullable(),
  type: categoryTypeEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryType = z.infer<typeof categoryTypeEnum>;
