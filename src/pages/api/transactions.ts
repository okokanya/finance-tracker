import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { transactions } from '@/db/schema';
import { transactionSchema } from '@/models';

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
    const { accountId } = req.query;

    const data = accountId
      ? await db
          .select()
          .from(transactions)
          .where(eq(transactions.accountId, String(accountId)))
      : await db.select().from(transactions);

    const parsedData = transactionSchema.array().parse(data);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}
