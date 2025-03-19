import { z } from 'zod';

import { Category, categorySchema } from '@/models';

export const categoryFormSchema = categorySchema.pick({ name: true, description: true });

export type CategoryForm = z.infer<typeof categoryFormSchema> & {};

export type CategoryResponse = {
  data?: (Category & { totalAmount: number })[];
  status: number;
  error?: string;
};
