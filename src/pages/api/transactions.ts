import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { accounts, categories, transactions } from '@/db/schema';
import { transactionSchema } from '@/models';

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

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newTransaction = transactionSchema.parse(req.body);

    let amount = newTransaction.amount;
    if (newTransaction.categoryId) {
      const category = await db
        .select({ type: categories.type })
        .from(categories)
        .where(eq(categories.id, newTransaction.categoryId))
        .then(rows => rows[0]);

      if (category && category.type === 'expense') {
        amount = -Math.abs(amount);
      } else {
        amount = Math.abs(amount);
      }
    } else {
      switch (newTransaction.type) {
        case 'withdrawal':
          amount = -Math.abs(amount);
          break;
        case 'topup':
          amount = Math.abs(amount);
          break;
      }
    }

    await db.transaction(async tx => {
      await tx.insert(transactions).values({
        ...newTransaction,
        amount,
      });

      if (newTransaction.type === 'transfer' && newTransaction.targetAccountId) {
        await tx
          .update(accounts)
          .set({
            balance: sql`balance - ${amount}`,
          })
          .where(eq(accounts.id, newTransaction.accountId));

        await tx
          .update(accounts)
          .set({
            balance: sql`balance + ${amount}`,
          })
          .where(eq(accounts.id, newTransaction.targetAccountId));
      } else {
        await tx
          .update(accounts)
          .set({
            balance: sql`balance + ${amount}`,
          })
          .where(eq(accounts.id, newTransaction.accountId));
      }
    });

    return res.status(201).json({ ...newTransaction, amount });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(500).json({ error: 'Failed to create transaction' });
  }
}
