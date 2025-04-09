import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db'; // Предполагаем, что db настроен для работы с SQLite
import { transactions } from '@/db/schema'; // Импортируем таблицу transactions

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Запрос для получения всех значений createdAt (Unix timestamp)
    const results = await db
      .select({ createdAt: transactions.createdAt }) // Выбираем только поле createdAt
      .from(transactions); // Из таблицы transactions

    // Проверяем, есть ли данные
    if (results.length === 0) {
      console.log('Нет данных в поле createdAt');
      return res.status(200).json({ message: 'Нет данных в поле createdAt', data: [] });
    } else {
      // Массив для хранения значений createdAt
      const createdAtArray = results.map(row => row.createdAt);

      // Отправляем массив в ответе
      return res.status(200).json({ message: 'Даты успешно получены', data: createdAtArray });
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return res.status(500).json({ error: 'Не удалось получить данные' });
  }
}
