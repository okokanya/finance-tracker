import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions, accounts, categories } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { monthYear } = req.query;

    let whereConditions = [];

    // Добавляем join условия
    whereConditions.push(eq(transactions.accountId, accounts.id));
    whereConditions.push(eq(transactions.categoryId, categories.id));

    // Добавляем фильтр по месяцу и году если передан
    if (monthYear && typeof monthYear === 'string') {
      const [year, month] = monthYear.split('-').map(Number);

      // Создаем границы месяца (начало и конец)
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      // Используем sql-выражение для фильтрации
      whereConditions.push(sql`
        ${transactions.createdAt} >= ${Math.floor(startDate.getTime() / 1000)}
        AND ${transactions.createdAt} <= ${Math.floor(endDate.getTime() / 1000)}
      `);
    }

    const result = await db
      .select({
        id: transactions.id, // Добавляем ID транзакции
        date: sql<string>`strftime('%d.%m.%Y', datetime(${transactions.createdAt}, 'unixepoch'))`,
        accountName: accounts.name,
        categoryName: categories.name,
        comment: transactions.comment,
        amount: transactions.amount,
        type: transactions.type,
      })
      .from(transactions)
      .leftJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(...whereConditions));

    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при получении транзакций:', error);
    res.status(500).json({ error: 'Ошибка при получении транзакций' });
  }
}
