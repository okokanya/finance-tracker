// pages/api/dpl/bar.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { and, sql, eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { monthYear } = req.query;

    if (!monthYear || typeof monthYear !== 'string') {
      return res.status(400).json({ error: 'Требуется параметр monthYear' });
    }

    const [year, month] = monthYear.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const result = await db
      .select({
        day: sql<string>`DATE(${transactions.createdAt}, 'unixepoch')`,
        totalAmount: sql<number>`SUM(${transactions.amount})`,
      })
      .from(transactions)
      .where(
        and(
          sql`${transactions.createdAt} >= ${Math.floor(startDate.getTime() / 1000)}`,
          sql`${transactions.createdAt} <= ${Math.floor(endDate.getTime() / 1000)}`,
          eq(transactions.type, 'withdrawal') // Только транзакции типа "расход"
        )
      )
      .groupBy(sql`DATE(${transactions.createdAt}, 'unixepoch')`)
      .having(sql`SUM(${transactions.amount}) > 0`)
      .orderBy(sql`DATE(${transactions.createdAt}, 'unixepoch')`);

    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при получении данных для столбчатой диаграммы:', error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
}
