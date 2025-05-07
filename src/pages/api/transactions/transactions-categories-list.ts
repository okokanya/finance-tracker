import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db';
import { categories } from '@/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Метод не разрешён
  }

  try {
    const result = await db.select({ name: categories.name }).from(categories);

    const categoryNames = result.map(cat => cat.name);

    return res.status(200).json(categoryNames);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    return res.status(500).json({ error: 'Ошибка при получении категорий' });
  }
}
