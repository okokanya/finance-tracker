import { z } from 'zod';

import { ACCOUNT_TYPES } from '@/types/enums';

export const accountTypeEnum = z.enum(ACCOUNT_TYPES);

export const accountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z
    .string()
    .min(1, 'Название не может быть пустым')
    .max(30, 'Название не должно превышать 30 символов'),
  description: z
    .string()
    .max(200, 'Описание не должно превышать 200 символов')
    .transform(val => val.trim() === '' ? null : val)
    .nullable(),
  type: accountTypeEnum,
  balance: z.number().default(0),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Account = z.infer<typeof accountSchema>;
export type AccountType = z.infer<typeof accountTypeEnum>;
