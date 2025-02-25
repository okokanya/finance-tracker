import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { accounts } from '@/db/schema';
import { accountSchema } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    case 'POST':
      return await POST(req, res);
    default:
      return res.status(405).end();
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;

    const accountsQuery = userId
      ? db
          .select()
          .from(accounts)
          .where(eq(accounts.userId, String(userId)))
      : db.select().from(accounts);

    const totalBalanceQuery = userId
      ? db
          .select({ total: sql`sum(balance)` })
          .from(accounts)
          .where(eq(accounts.userId, String(userId)))
      : db.select({ total: sql`sum(balance)` }).from(accounts);

    const [accountsData, [totalBalance]] = await Promise.all([accountsQuery, totalBalanceQuery]);

    const parsedAccounts = accountSchema.array().parse(accountsData);
    const finalTotalBalance = Number(totalBalance?.total) ?? 0;

    return res.status(200).json({
      accounts: parsedAccounts,
      totalBalance: finalTotalBalance,
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;
    const { name, description, type, balance } = req.body;

    const newAccount = {
      id: uuidv4(),
      name,
      description,
      type,
      balance,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const parsedAccount = accountSchema.parse(newAccount);

    await db.insert(accounts).values(parsedAccount);

    return res.status(201).json(parsedAccount);
  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}
