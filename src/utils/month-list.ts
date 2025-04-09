import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { DateTime } from 'luxon';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  try {
    const results = await db.select({ createdAt: transactions.createdAt }).from(transactions);
    const monthNames = results.map((tx) =>
      DateTime.fromJSDate(new Date(tx.createdAt))
        .setLocale('ru')
        .toFormat('LLLL')
    );

    const uniqueMonths = Array.from(new Set(monthNames));

    res.status(200).json(uniqueMonths);
  } catch (error) {
    console.error('Ошибка при получении месяцев:', error);
    res.status(500).json([]);
  }
}
