import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // уникальные месяц+год
    const uniqueMonthYears = await db.all<{ monthYear: string }>(sql`
      SELECT DISTINCT strftime('%Y-%m', datetime(createdAt, 'unixepoch')) as monthYear
      FROM transactions
      ORDER BY monthYear DESC
    `);

    const monthYears = uniqueMonthYears.map(row => row.monthYear);

    if (monthYears.length === 0) {
      console.log('Нет данных в поле createdAt');
      return res.status(200).json({ message: 'Нет данных в поле createdAt', data: [] });
    }

    return res.status(200).json({
      message: 'Месяцы и года успешно получены',
      data: monthYears
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return res.status(500).json({ error: 'Не удалось получить данные' });
  }
}
