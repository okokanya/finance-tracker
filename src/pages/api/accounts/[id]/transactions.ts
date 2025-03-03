import type { NextApiRequest, NextApiResponse } from 'next';
import { and, desc, eq, or, sql } from 'drizzle-orm';

import { db } from '@/db';
import { accounts, categories, transactions } from '@/db/schema';
import { FAKE_USER_ID } from '@/features/accounts/accounts.constants';
import { accountTransactionSchema } from '@/features/accounts/accounts.types';

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
    const userId = FAKE_USER_ID;
    const { id } = req.query;

    const data = await db
      .select({
        id: transactions.id,
        description: sql<string>`
          CASE
            WHEN ${categories.name} IS NOT NULL THEN ${categories.name}
            WHEN ${accounts.name} IS NOT NULL THEN ${accounts.name}
            ELSE NULL
          END
        `,
        amount: sql<number>`
          CASE
            WHEN ${transactions.type} = 'withdrawal' THEN -${transactions.amount}
            WHEN ${transactions.type} = 'transfer' AND ${transactions.accountId} = ${String(id)} THEN -${transactions.amount}
            ELSE ${transactions.amount}
          END
        `,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .leftJoin(
        accounts,
        or(
          and(
            eq(transactions.accountId, String(id)),
            eq(accounts.id, transactions.targetAccountId)
          ),
          and(eq(transactions.targetAccountId, String(id)), eq(accounts.id, transactions.accountId))
        )
      )
      .where(
        and(
          eq(transactions.userId, String(userId)),
          or(eq(transactions.accountId, String(id)), eq(transactions.targetAccountId, String(id)))
        )
      )
      .orderBy(desc(transactions.updatedAt));

    const parsedData = accountTransactionSchema.array().parse(data);

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}
