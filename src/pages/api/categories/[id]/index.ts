import { NextApiRequest, NextApiResponse } from 'next';
import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { categoryFormSchema } from '@/features/category/category.types';
import { Category } from '@/models';
import { getUser } from '@/utils/get-user';

type Response = {
  status: number;
  error?: string;
  data?: Category;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    switch (req.method) {
      case 'GET':
        return await GET(req, res);
      case 'PUT':
        return await PUT(req, res);
      case 'DELETE':
        return await DELETE(req, res);
      default:
        return res.status(405).end();
    }
  } catch (error) {
    console.error('Category API error:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const userId = await getUser(req);
    const { id } = req.query;

    const category = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id as string), eq(categories.userId, String(userId))))
      .get();

    if (!category) {
      return res.status(404).json({ status: 404, error: 'Категория не найдена' });
    }

    return res.status(200).json({ status: 200, data: category });
  } catch (error) {
    console.error('Get category by id error:', error);

    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const userId = await getUser(req);
    const { id } = req.query;

    const { name, description } = categoryFormSchema.parse(req.body);

    const updatedCategory = await db
      .update(categories)
      .set({
        name,
        description,
        updatedAt: sql`(strftime('%s', 'now'))`,
      })
      .where(and(eq(categories.id, id as string), eq(categories.userId, String(userId))))
      .returning()
      .get();

    if (!updatedCategory) {
      return res.status(404).json({ status: 404, error: 'Категория не найдена' });
    }

    return res.status(200).json({ status: 200, data: updatedCategory });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);
    const { id } = req.query;

    const category = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id as string), eq(categories.userId, String(userId))))
      .get();

    if (!category) {
      return res.status(404).json({ status: 404, error: 'Category not found' });
    }

    await db
      .delete(categories)
      .where(and(eq(categories.id, id as string), eq(categories.userId, String(userId))))
      .run();

    return res.status(204).end();
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({ status: 500, error: 'Internal server error' });
  }
}
