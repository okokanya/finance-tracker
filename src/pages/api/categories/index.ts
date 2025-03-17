import { NextApiRequest, NextApiResponse } from 'next';
import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { categories, transactions } from '@/db/schema';
import { CategoryResponse } from '@/features/category/category.types';
import { getUser } from '@/utils/get-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse<CategoryResponse>) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    case 'POST':
      return await POST(req, res);
    default:
      return res.status(405).end();
  }
}

const GET = async (req: NextApiRequest, res: NextApiResponse<CategoryResponse>) => {
  try {
    const userId = await getUser(req);

    if (userId) {
      const data = await db
        .select({
          category: categories,
          total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`.as('total'),
        })
        .from(categories)
        .leftJoin(
          transactions,
          and(
            eq(transactions.categoryId, categories.id),
            eq(transactions.userId, String(userId)) // Фильтр транзакций пользователя
          )
        )
        .where(eq(categories.userId, String(userId)))
        .groupBy(categories.id);

      const preparedData = data.map(item => ({ ...item.category, totalAmount: item.total }));

      return res.status(200).json({ status: 200, data: preparedData });
    }

    return res.status(404).json({ status: 404, error: 'Пользователь не найден' });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ status: 500, error: 'Failed to fetch categories' });
  }
};

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ status: 500, error: 'Ошибка в создании категории' });
  }
};
