import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions, accounts, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Тип данных, которые вернёт API
type TransactionResult = {
  date: string;
  accountName: string | null;
  categoryName: string | null;
  comment: string | null;
  amount: number;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const resultRaw = await db
      .select({
        date: transactions.createdAt,
        accountName: accounts.name,
        categoryName: categories.name,
        comment: transactions.comment,
        amount: transactions.amount,
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id));

    const result: TransactionResult[] = resultRaw.map((tx) => ({
      date: new Date(
        typeof tx.date === 'number' ? tx.date * 1000 : tx.date.getTime()
      ).toLocaleDateString('ru-RU'),
      accountName: tx.accountName ?? null,
      categoryName: tx.categoryName ?? null,
      comment: tx.comment ?? null,
      amount: tx.amount,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при получении транзакций:', error);
    res.status(500).json({ error: 'Ошибка при получении транзакций' });
  }
}
