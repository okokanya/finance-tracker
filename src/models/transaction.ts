import { z } from 'zod';

import { TRANSACTION_TYPES } from '@/types/enums';

export const transactionTypeEnum = z.enum(TRANSACTION_TYPES);

export const transactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  targetAccountId: z.string().uuid().nullable(),
  type: transactionTypeEnum,
  amount: z.number(),
  comment: z
    .string()
    .min(1, 'Комментарий не может быть пустым')
    .max(200, 'Комментарий не должен превышать 200 символов')
    .nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Transaction = z.infer<typeof transactionSchema>;
export type TransactionType = z.infer<typeof transactionTypeEnum>;
