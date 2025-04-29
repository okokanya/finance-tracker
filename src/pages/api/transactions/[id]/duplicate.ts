import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    const [originalTx] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, id as string))
      .limit(1);

    if (!originalTx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const newTransaction = {
      ...originalTx,
      id: uuidv4(),
      createdAt: originalTx.createdAt, // Сохраняем оригинальную дату создания
      updatedAt: new Date(), // Обновляем только дату изменения
    };

    await db.insert(transactions).values(newTransaction);

    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error duplicating transaction:', error);
    return res.status(500).json({ error: 'Failed to duplicate transaction' });
  }
}
