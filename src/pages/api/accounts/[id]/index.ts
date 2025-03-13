import type { NextApiRequest, NextApiResponse } from 'next';
import { and, eq, ne, or, sql } from 'drizzle-orm';

import { db } from '@/db';
import { accounts, transactions } from '@/db/schema';
import { accountBaseSchema } from '@/features/accounts/accounts.types';
import { accountSchema } from '@/models';
import { getUser } from '@/utils/get-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return await PUT(req, res);
    case 'DELETE':
      return await DELETE(req, res);
    default:
      return res.status(405).end();
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);
    const { id } = req.query;
    const { name, description, type, balance, isArchived } = accountBaseSchema.parse(req.body);

    const existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, String(id)))
      .limit(1);

    if (!existingAccount.length) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (existingAccount[0].userId !== String(userId)) {
      return res.status(403).json({ error: 'Not authorized to update this account' });
    }

    const updateData = {
      name,
      description,
      type,
      balance,
      isArchived,
      updatedAt: new Date(),
    };

    const parsedUpdate = accountSchema.partial().parse(updateData);

    const [updatedAccount] = await db
      .update(accounts)
      .set(parsedUpdate)
      .where(eq(accounts.id, String(id)))
      .returning();

    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ error: 'Failed to update account' });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);
    const { id } = req.query;

    const existingAccount = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, String(id)))
      .limit(1);

    if (!existingAccount.length) {
      return res.status(404).json({ error: 'Account not found' });
    }

    if (existingAccount[0].userId !== String(userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this account' });
    }

    const result = await db.transaction(async tx => {
      const accountTransactions = await tx.query.transactions.findMany({
        where: or(
          eq(transactions.accountId, String(id)),
          eq(transactions.targetAccountId, String(id))
        ),
      });

      for (const transaction of accountTransactions) {
        switch (transaction.type) {
          case 'transfer':
            if (transaction.accountId === id && transaction.targetAccountId) {
              await tx
                .update(accounts)
                .set({
                  balance: sql`balance - ${transaction.amount}`,
                })
                .where(and(eq(accounts.id, transaction.targetAccountId), ne(accounts.id, id)));
            }

            if (transaction.targetAccountId === id) {
              await tx
                .update(accounts)
                .set({
                  balance: sql`balance + ${transaction.amount}`,
                })
                .where(and(eq(accounts.id, transaction.accountId), ne(accounts.id, id)));
            }
            break;
        }

        await tx.delete(transactions).where(eq(transactions.id, transaction.id));
      }

      const [deletedAccount] = await tx
        .delete(accounts)
        .where(eq(accounts.id, String(id)))
        .returning();

      return deletedAccount;
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
}
