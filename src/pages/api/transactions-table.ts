import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions, accounts, categories } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

type TransactionResult = {
  date: string;
  accountName: string | null;
  categoryName: string | null;
  comment: string | null;
  amount: number;
  type: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // текущий месяц и год
    const now = new Date();
    const targetMonth = now.getMonth(); // с 0 -- январь
    const targetYear = now.getFullYear();

    // начало и конец месяца для фильтра
    const monthStart = new Date(targetYear, targetMonth, 1);
    const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

    const resultRaw = await db
      .select({
        date: transactions.createdAt,
        accountName: accounts.name,
        categoryName: categories.name,
        comment: transactions.comment,
        amount: transactions.amount,
        type: transactions.type,
      })
      .from(transactions)
      .where(
        and(
          sql`${transactions.createdAt} >= ${monthStart}`,
          sql`${transactions.createdAt} <= ${monthEnd}`
        )
      )
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
      type: tx.type,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при получении транзакций:', error);
    res.status(500).json({ error: 'Ошибка при получении транзакций' });
  }
}
