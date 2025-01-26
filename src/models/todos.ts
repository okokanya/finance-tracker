import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.date({ coerce: true }),
});
export type Todo = z.infer<typeof todoSchema>;
