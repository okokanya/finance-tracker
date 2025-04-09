import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db'; // Настроенный клиент для SQLite
import { transactions } from '@/db/schema'; // Схема таблицы transactions

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const results = await db
      .select({ createdAt: transactions.createdAt })
      .from(transactions);

    if (results.length === 0) {
      console.log('Нет данных в поле createdAt');
      return res.status(200).json({ message: 'Нет данных в поле createdAt', data: [] });
    }

    // Преобразуем timestamp в объекты с полями month и year
    const monthYearSet = new Set<string>();
    const monthYearArray = results.map(row => {
      const date = new Date(row.createdAt); // Преобразуем Unix в Date
      const month = date.getMonth() + 1; // Январь = 0, поэтому +1
      const year = date.getFullYear();
      return { month, year };
    });

    // Убираем дубликаты
    const uniqueMonthYears = monthYearArray.filter(({ month, year }) => {
      const key = `${month}-${year}`;
      if (monthYearSet.has(key)) return false;
      monthYearSet.add(key);
      return true;
    });

    return res.status(200).json({ message: 'Месяцы и года успешно получены', data: uniqueMonthYears });
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return res.status(500).json({ error: 'Не удалось получить данные' });
  }
}
