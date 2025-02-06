import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { accounts } from '@/db/schema';
import { accountSchema } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    default:
      return res.status(405).end();
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;

    const data = userId
      ? await db
          .select()
          .from(accounts)
          .where(eq(accounts.userId, String(userId)))
      : await db.select().from(accounts);

    const parsedData = accountSchema.array().parse(data);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}
