import type { NextApiRequest, NextApiResponse } from 'next';
import { and, eq, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { accounts } from '@/db/schema';
import { accountBaseSchema, accountResponseSchema } from '@/features/accounts/accounts.types';
import { accountSchema } from '@/models';
import { getUser } from '@/utils/get-user';

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
    const userId = await getUser(req);

    const accountsQuery = db
      .select({
        id: accounts.id,
        name: accounts.name,
        description: accounts.description,
        type: accounts.type,
        balance: accounts.balance,
        displayBalance: sql<number>`
              CASE
                WHEN ${accounts.type} = 'debt_i_owe' THEN -${accounts.balance}
                ELSE ${accounts.balance}
              END
            `,
        isArchived: accounts.isArchived,
      })
      .from(accounts)
      .where(and(eq(accounts.userId, String(userId)), eq(accounts.isArchived, false)));

    const totalBalanceQuery = db
      .select({
        total: sql`sum(
              CASE
                WHEN type = 'debt_i_owe' THEN -balance
                ELSE balance
              END
            )`,
      })
      .from(accounts)
      .where(and(eq(accounts.userId, String(userId)), eq(accounts.isArchived, false)));

    const [accountsData, [totalBalance]] = await Promise.all([accountsQuery, totalBalanceQuery]);

    const parsedAccounts = accountResponseSchema.array().parse(accountsData);
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
    const userId = await getUser(req);
    const { name, description, type, balance } = accountBaseSchema.parse(req.body);

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
