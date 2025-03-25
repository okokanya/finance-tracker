import { z } from 'zod';

import { ACCOUNT_LIMITS } from '@/features/accounts/accounts.constants';
import texts from '@/features/accounts/accounts.texts';
import { ACCOUNT_TYPES } from '@/types/enums';

export const accountTypeEnum = z.enum(ACCOUNT_TYPES);

export const accountSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z
    .string()
    .min(1, texts.inputError.empty)
    .max(30, texts.inputError.nameMax)
    .transform(val => val.trim()),
  description: z
    .string()
    .max(200, texts.inputError.descriptionMax)
    .transform(val => (val.trim() === '' ? null : val))
    .nullable(),
  type: accountTypeEnum,
  balance: z
    .number({ message: texts.inputError.empty })
    .min(ACCOUNT_LIMITS.MIN_VALUE, texts.inputError.minBalance)
    .max(ACCOUNT_LIMITS.MAX_VALUE, texts.inputError.maxAmount),
  isArchived: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Account = z.infer<typeof accountSchema>;
export type AccountType = z.infer<typeof accountTypeEnum>;
