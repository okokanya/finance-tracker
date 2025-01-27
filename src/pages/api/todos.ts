// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db';
import { todos } from '@/db/schema';
import { Todo, todoSchema } from '@/models/todos';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return await GET(req, res);
  }

  return res.status(501).end();
}

async function GET(_req: NextApiRequest, res: NextApiResponse<Todo[]>) {
  const data = await db.select().from(todos);
  const parsedData = todoSchema.array().parse(data);

  return res.status(200).json(parsedData);
}
