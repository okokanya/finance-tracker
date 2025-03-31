import { z } from 'zod';

import { Category, categorySchema } from '@/models';

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
