import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { accounts } from '@/db/schema';
import { accountSchema } from '@/models';

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
          .from(accounts)
          .where(eq(accounts.userId, String(userId)))
      : await db.select().from(accounts);

    const parsedData = accountSchema.array().parse(data);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return res.status(500).json({ error: 'Failed to fetch accounts' });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const newAccount = accountSchema.parse(req.body);
    await db.insert(accounts).values(newAccount);
    return res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error creating account:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}

async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updatedAccount = accountSchema.parse(req.body);

    await db
      .update(accounts)
      .set(updatedAccount)
      .where(eq(accounts.id, String(id)));

    return res.status(200).json(updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ error: 'Failed to update account' });
  }
}

async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    await db.delete(accounts).where(eq(accounts.id, String(id)));
    return res.status(204).end();
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
}
