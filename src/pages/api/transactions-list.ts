// pages/api/transactions-list.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { categories } from '@/db/schema';

type Category = {
  id: string;
  name: string;
};

type CategoryResponse = {
  data?: Category[];
  status: number;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<CategoryResponse>) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    default:
      return res.status(405).end();
  }
}

const GET = async (req: NextApiRequest, res: NextApiResponse<CategoryResponse>) => {
  try {
    const data = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories);

    console.log('Categories:', data); // Логируем категории

    return res.status(200).json({ status: 200, data });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ status: 500, error: 'Failed to fetch categories' });
  }
};
