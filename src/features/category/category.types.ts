import { z } from 'zod';

import { categorySchema } from '@/models';

export const categoryFormSchema = categorySchema.pick({ name: true, description: true });

export type CategoryForm = z.infer<typeof categoryFormSchema> & {};
