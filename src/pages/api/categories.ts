import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { categorySchema } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    case 'POST':
      return await POST(req, res);
    case 'PUT':
      return await PUT(req, res);
    case 'DELETE':
      return await DELETE(req, res);
    default:
      return res.status(405).end();
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId } = req.query;

    const data = userId
      ? await db
          .select()
          .from(categories)
          .where(eq(categories.userId, String(userId)))
      : await db.select().from(categories);

    const parsedData = categorySchema.array().parse(data);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newCategory = categorySchema.parse(req.body);
    await db.insert(categories).values(newCategory);
    return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ error: 'Failed to create category' });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updatedCategory = categorySchema.parse(req.body);

    await db
      .update(categories)
      .set(updatedCategory)
      .where(eq(categories.id, String(id)));

    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    return res.status(500).json({ error: 'Failed to update category' });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    await db.delete(categories).where(eq(categories.id, String(id)));
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
}
