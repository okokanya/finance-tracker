import type { NextApiRequest, NextApiResponse } from 'next';
import { and, desc, eq, isNull, or, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

import { db } from '@/db';
import { accounts, categories, transactions } from '@/db/schema';
import { ACCOUNT_TRANSACTION_TYPES } from '@/features/accounts/accounts.constants';
import {
  accountTransactionSchema,
  addAccountTransactionFormSuccessResultSchema,
} from '@/features/accounts/accounts.types';
import { getUser } from '@/utils/get-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    case 'PUT':
      return await PUT(req, res);
    default:
      return res.status(405).end();
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);
    const { id } = req.query;

    const data = await db
      .select({
        id: transactions.id,
        accountId: transactions.accountId,
        targetAccountId: transactions.targetAccountId,
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
          and(
            eq(transactions.targetAccountId, String(id)),
            eq(accounts.id, transactions.accountId)
          ),
          and(eq(transactions.accountId, accounts.id), isNull(transactions.targetAccountId))
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

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);
    const { id: accountId } = req.query;

    const { type, amount, targetAccountId } = addAccountTransactionFormSuccessResultSchema.parse(
      req.body
    );

    if (!ACCOUNT_TRANSACTION_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    const result = await db.transaction(async tx => {
      if (type === 'transfer' && targetAccountId) {
        const [sourceAccount, targetAccount] = await Promise.all([
          tx.query.accounts.findFirst({
            where: and(eq(accounts.id, String(accountId)), eq(accounts.userId, String(userId))),
          }),
          tx.query.accounts.findFirst({
            where: and(eq(accounts.id, targetAccountId), eq(accounts.userId, String(userId))),
          }),
        ]);

        if (!sourceAccount || !targetAccount) {
          throw new Error('Account not found');
        }

        if (amount > sourceAccount.balance && sourceAccount.type !== 'debt_i_owe') {
          throw new Error('Insufficient funds for transfer');
        }

        if (targetAccount.type === 'debt_i_owe' && amount > targetAccount.balance) {
          throw new Error('Cannot repay more than the current debt amount');
        }

        const restrictedTypes = ['savings', 'debt_i_owe', 'debt_they_owe'];
        if (restrictedTypes.includes(sourceAccount.type) && targetAccount.type !== 'regular') {
          throw new Error(
            'Transfers from savings and debt accounts are only allowed to regular accounts'
          );
        }

        await Promise.all([
          tx
            .update(accounts)
            .set({
              balance: getBalanceUpdateQuery(sourceAccount.type, amount, true),
            })
            .where(eq(accounts.id, String(accountId))),
          tx
            .update(accounts)
            .set({
              balance: getBalanceUpdateQuery(targetAccount.type, amount, false),
            })
            .where(eq(accounts.id, targetAccountId)),
        ]);
      } else if (type === 'topup') {
        const account = await tx.query.accounts.findFirst({
          where: and(eq(accounts.id, String(accountId)), eq(accounts.userId, String(userId))),
        });

        if (!account) {
          throw new Error('Account not found');
        }

        if (account.type === 'debt_i_owe' && amount > account.balance) {
          throw new Error('Cannot repay more than the current debt amount');
        }

        await tx
          .update(accounts)
          .set({
            balance: getBalanceUpdateQuery(account.type, amount, false),
          })
          .where(eq(accounts.id, String(accountId)));
      }

      return await tx.insert(transactions).values({
        id: uuidv4(),
        userId: String(userId),
        accountId: String(accountId),
        targetAccountId: targetAccountId,
        amount: amount,
        type: type,
      });
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error creating transaction:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create transaction',
    });
  }
}

const getBalanceUpdateQuery = (accountType: string, amount: number, isDecrease: boolean) => {
  const operator = accountType === 'debt_i_owe' ? (isDecrease ? '+' : '-') : isDecrease ? '-' : '+';
  return sql`balance ${sql.raw(operator)} ${amount}`;
};
