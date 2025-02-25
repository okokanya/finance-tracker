import { z } from 'zod';

import { Account } from '@/models';
import { accountSchema } from '@/models/account';

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
});

export type AccountForm = z.infer<typeof accountFormSchema>;

export type AccountFormSuccessResult = z.infer<typeof accountBaseSchema>;
