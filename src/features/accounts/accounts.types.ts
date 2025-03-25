import { z } from 'zod';

import { ACCOUNT_LIMITS, ACCOUNT_TRANSACTION_TYPES } from '@/features/accounts/accounts.constants';
import texts from '@/features/accounts/accounts.texts';
import { accountSchema } from '@/models';

export const accountResponseSchema = accountSchema
  .omit({
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    displayBalance: z.number().min(ACCOUNT_LIMITS.MAX_NEGATIVE_VALUE).max(ACCOUNT_LIMITS.MAX_VALUE),
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
  amount: z.number().min(ACCOUNT_LIMITS.MAX_NEGATIVE_VALUE).max(ACCOUNT_LIMITS.MAX_VALUE),
});

export const addAccountTransactionFormSchema = z.object({
  amount: z
    .number({ message: texts.inputError.empty })
    .min(ACCOUNT_LIMITS.MIN_TRANSACTION, texts.inputError.minTransaction)
    .max(ACCOUNT_LIMITS.MAX_VALUE, texts.inputError.maxAmount),
});

export const addAccountTransactionFormSuccessResultSchema = addAccountTransactionFormSchema.extend({
  type: z.enum(ACCOUNT_TRANSACTION_TYPES),
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

export type AddAccountTransactionForm = z.infer<typeof addAccountTransactionFormSchema>;

export type AddAccountTransactionFormSuccessResult = z.infer<
  typeof addAccountTransactionFormSuccessResultSchema
>;

export type TransactionValidationResult = {
  isValid: boolean;
  error?: string;
};
