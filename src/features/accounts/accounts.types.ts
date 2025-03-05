import { z } from 'zod';

import { Account, accountSchema } from '@/models';

export interface AccountsResponse {
  accounts: Account[];
  totalBalance: number;
}

const accountBaseSchema = accountSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const accountFormSchema = accountBaseSchema.omit({
  type: true,
  isArchived: true,
});

export const accountTransactionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().nullable(),
  amount: z.number(),
});

export type AccountForm = z.infer<typeof accountFormSchema>;

export type AccountFormSuccessResult = z.infer<typeof accountBaseSchema>;

export type AccountTransaction = z.infer<typeof accountTransactionSchema>;
