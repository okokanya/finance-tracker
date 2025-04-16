import { z } from 'zod';

import { Category, categorySchema, transactionSchema } from '@/models';

export const categoryFormSchema = categorySchema.pick({ name: true, description: true });

export type CategoryForm = z.infer<typeof categoryFormSchema> & {};

export const categoryCreateSchema = categorySchema.pick({
  name: true,
  description: true,
  type: true,
});

export type CategoryCreate = z.infer<typeof categoryCreateSchema>;

export type CategoryResponse = {
  data?: (Category & { totalAmount: number })[];
  status: number;
  error?: string;
};

export type TransactionFormData = Omit<
  z.infer<typeof transactionSchema>,
  'id' | 'userId' | 'createdAt' | 'updatedAt' | 'targetAccountId'
> & {
  day: number;
  month: number;
  year: number;
};
