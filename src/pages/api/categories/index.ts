import { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { Category } from '@/models';

type CategoryResponse = {
  data?: Category[];
  status: number;
  error?: string;
};

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
    // TODO: получения пользователя из токена
    const { userId } = req.query;

    if (userId) {
      const data = await db
        .select()
        .from(categories)
        .where(eq(categories.userId, String(userId)));
      return res.status(200).json({ status: 200, data });
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
