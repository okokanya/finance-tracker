import { NextApiRequest, NextApiResponse } from 'next';
import { and, between, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { categories, transactions } from '@/db/schema';
import { REPORTS_MONTH_CURRENT } from '@/features/reports/reports.constants';
import { getUser } from '@/utils/get-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Аутентификация пользователя
  const userId = (await getUser(req)) as string;
  if (!userId) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  // Получение параметров запроса
  const { month = REPORTS_MONTH_CURRENT } = req.query;

  try {
    // Расчет диапазона дат
    const now = new Date();
    const [startDate, endDate] = (() => {
      const year = now.getFullYear();
      const monthIndex = now.getMonth();

      return month === 'current'
        ? [new Date(year, monthIndex, 1), new Date(year, monthIndex + 1, 0)]
        : [new Date(year, monthIndex - 1, 1), new Date(year, monthIndex, 0)];
    })();

    const monthNumber = startDate.getMonth() + 1; // +1 т.к. месяцы 0-based

    // Конвертация в UNIX timestamp
    const startUnix = Math.floor(startDate.getTime() / 1000);
    const endUnix = Math.floor(endDate.getTime() / 1000);
    const daysInMonth = endDate.getDate();

    // Запрос данных для графиков
    const transactionsData = await db
      .select({
        type: transactions.type,
        day: sql<number>`
          CAST(strftime('%d', datetime(${transactions.createdAt}, 'unixepoch')) AS INTEGER)
        `.as('day'),
        dailySum: sql<number>`
          COALESCE(CAST(SUM(${transactions.amount}) AS INTEGER), 0)
        `.as('dailySum'),
      })
      .from(transactions)
      .where(
        and(
          eq(transactions.userId, userId),
          between(transactions.createdAt, sql`${startUnix}`, sql`${endUnix}`)
        )
      )
      .groupBy(transactions.type, sql`day`);

    // Запрос данных по категориям
    const categoriesData = await db
      .select({
        categoryId: transactions.categoryId,
        type: transactions.type,
        total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        name: categories.name,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.userId, userId),
          between(transactions.createdAt, sql`${startUnix}`, sql`${endUnix}`)
        )
      )
      .groupBy(transactions.categoryId, transactions.type);

    // Обработка данных для графиков
    const processChartData = (type: 'topup' | 'withdrawal') => {
      const daysMap = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        value: 0,
      }));

      transactionsData
        .filter(t => t.type === type)
        .forEach(({ day, dailySum }) => {
          const index = day - 1;
          if (index >= 0 && index < daysInMonth) {
            daysMap[index].value = Number(dailySum);
          }
        });

      const total = daysMap.reduce((acc, curr) => acc + curr.value, 0);
      const average = total / daysInMonth || 0;

      return {
        data: daysMap,
        average: Math.round(average * 100) / 100,
        monthNumber,
      };
    };

    // Расчет общих сумм
    const totalIncome = transactionsData
      .filter(t => t.type === 'topup')
      .reduce((acc, curr) => acc + curr.dailySum, 0);

    const totalExpense = transactionsData
      .filter(t => t.type === 'withdrawal')
      .reduce((acc, curr) => acc + curr.dailySum, 0);

    // Обработка категорий
    const processedCategories = categoriesData.map(cat => {
      const total = cat.type === 'topup' ? totalIncome : totalExpense;
      const percentage = total !== 0 ? Math.round((Number(cat.total) / total) * 10000) / 100 : 0;

      return {
        id: cat.categoryId || 'uncategorized',
        name: cat.name || 'Без категории',
        type: cat.type,
        amount: Number(cat.total),
        percentage,
      };
    });

    // Расчет средних значений
    const incomeData = processChartData('topup');
    const expenseData = processChartData('withdrawal');

    // Формирование ответа
    return res.status(200).json({
      income: incomeData,
      expense: expenseData,
      categories: processedCategories,
      averages: {
        daily: {
          income: incomeData.average,
          expense: expenseData.average,
        },
        weekly: {
          income: Math.round(incomeData.average * 7 * 100) / 100,
          expense: Math.round(expenseData.average * 7 * 100) / 100,
        },
      },
    });
  } catch (error) {
    console.error('Ошибка при получении отчета:', error);
    return res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: error instanceof Error ? error.message : 'Неизвестная ошибка',
    });
  }
}
