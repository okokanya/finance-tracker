import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions, categories } from '@/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

interface PieChartData {
  date: string; // Дата транзакции (YYYY-MM-DD)
  name: string; // Название категории
  color: string; // Цвет категории
  amount: number; // Сумма траты
  share: number; // Доля в процентах
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { year, month, userId } = req.query;

  // Валидация параметров
  if (!year || !month || !userId) {
    return res.status(400).json({ error: 'year, month и userId обязательны' });
  }

  const yearNum = parseInt(year as string, 10);
  const monthNum = parseInt(month as string, 10);

  if (
    isNaN(yearNum) ||
    isNaN(monthNum) ||
    monthNum < 1 ||
    monthNum > 12 ||
    yearNum < 2000 ||
    yearNum > 2100
  ) {
    return res.status(400).json({ error: 'Неверный формат года или месяца' });
  }

  try {
    // Определяем начало и конец месяца
    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999); // Последний день месяца

    // Запрос 1: Получение всех транзакций (расходов) за месяц
    const expenseTransactions = await db
      .select({
        date: sql<string>`strftime('%Y-%m-%d', ${transactions.createdAt})`,
        name: categories.name,
        color: categories.color,
        amount: transactions.amount,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId as string),
          eq(transactions.type, 'withdrawal'),
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate)
        )
      );

    if (expenseTransactions.length === 0) {
      return res.status(404).json({ error: 'Расходы за указанный период не найдены' });
    }

    // Запрос 2: Вычисление общей суммы расходов
    const totalExpensesResult = await db
      .select({
        total: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId as string),
          eq(transactions.type, 'expense'),
          gte(transactions.createdAt, startDate),
          lte(transactions.createdAt, endDate)
        )
      );

    const totalExpenses = Number(totalExpensesResult[0]?.total) || 0;

    // Формирование данных с вычислением доли
    const chartData: PieChartData[] = expenseTransactions.map((tx) => ({
      date: tx.date,
      name: tx.name || 'Без категории',
      color: tx.color || 'rgba(200, 200, 200, 1)',
      amount: Number(tx.amount),
      share: totalExpenses > 0 ? (Number(tx.amount) / totalExpenses) * 100 : 0,
    }));

    // Округление доли до 2 знаков после запятой
    chartData.forEach((item) => {
      item.share = Number(item.share.toFixed(2));
    });

    res.status(200).json(chartData);
  } catch (error) {
    console.error('Ошибка при запросе данных:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}
