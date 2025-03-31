import { NextApiRequest, NextApiResponse } from 'next';
import { and, eq, SQL, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { categories, transactions } from '@/db/schema';
import { categoryCreateSchema, CategoryResponse } from '@/features/category/category.types';
import { categorySchema, CategoryType } from '@/models';
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
      const { period, type } = req.query;

      let monthFilter: SQL | null = null;

      if (period === 'thisMonth' || period === 'prevMonth') {
        const currentMonth = sql`strftime('%Y-%m', 'now')`;
        const prevMonth = sql`strftime('%Y-%m', 'now', '-1 month')`;
        monthFilter = period === 'thisMonth' ? currentMonth : prevMonth;
      }

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
            eq(transactions.userId, String(userId)), // Фильтр транзакций пользователя
            ...(monthFilter
              ? [sql`strftime('%Y-%m', ${transactions.createdAt}, 'unixepoch') = ${monthFilter}`]
              : [])
          )
        )
        .where(
          and(
            eq(categories.userId, String(userId)),
            type ? eq(categories.type, String(type) as CategoryType) : undefined
          )
        )
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
    const userId = await getUser(req);
    const { name, description, type } = categoryCreateSchema.parse(req.body);

    const newCategoryData = {
      id: uuidv4(),
      name,
      description,
      userId,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const parsedCategory = categorySchema.parse(newCategoryData);

    await db.insert(categories).values(parsedCategory);

    return res.status(201).json(parsedCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ status: 500, error: 'Ошибка в создании категории' });
  }
};
