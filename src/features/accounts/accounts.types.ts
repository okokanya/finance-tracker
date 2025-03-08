import { z } from 'zod';

import { ACCOUNT_TRANSACTION_TYPES } from '@/features/accounts/accounts.constants';
import { accountSchema } from '@/models';

export const accountResponseSchema = accountSchema
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    displayBalance: z.number(),
  });

export const accountBaseSchema = accountSchema.omit({
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
  accountId: z.string().uuid(),
  targetAccountId: z.string().uuid().nullable(),
  description: z.string().nullable(),
  amount: z.number(),
});

export const accountTransactionFormSchema = z.object({
  amount: z.number(),
});

export const addAccountTransactionFormSuccessResultSchema = z.object({
  type: z.enum(ACCOUNT_TRANSACTION_TYPES),
  amount: z.number(),
  targetAccountId: z.string().uuid().nullable(),
});

export type AccountsResponse = {
  accounts: AccountResponse[];
  totalBalance: number;
};

export type AccountResponse = z.infer<typeof accountResponseSchema>;

export type AccountForm = z.infer<typeof accountFormSchema>;

export type AccountFormSuccessResult = z.infer<typeof accountBaseSchema>;

export type AccountTransaction = z.infer<typeof accountTransactionSchema>;

export type AccountTransactionType = (typeof ACCOUNT_TRANSACTION_TYPES)[number];

export type AccountTransactionForm = z.infer<typeof accountTransactionFormSchema>;

export type AddAccountTransactionFormSuccessResult = z.infer<
  typeof addAccountTransactionFormSuccessResultSchema
>;
