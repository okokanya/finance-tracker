import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions } from '@/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await db
      .select({ createdAt: transactions.createdAt })
      .from(transactions);

    if (results.length === 0) {
      console.log('Нет данных в поле createdAt');
      return res.status(200).json({ message: 'Нет данных в поле createdAt', data: [] });
    }

    // Преобразуем timestamp в строки формата "год-месяц"
    const monthYearSet = new Set<string>();
    const monthYearStrings = results.map(row => {
      const date = new Date(row.createdAt);
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Добавляем ведущий ноль
      const year = date.getFullYear();
      return `${year}-${month}`;
    });

    // Убираем дубликаты
    const uniqueMonthYears = monthYearStrings.filter(monthYear => {
      if (monthYearSet.has(monthYear)) return false;
      monthYearSet.add(monthYear);
      return true;
    });

    return res.status(200).json({
      message: 'Месяцы и года успешно получены',
      data: uniqueMonthYears
    });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return res.status(500).json({ error: 'Не удалось получить данные' });
  }
}
