import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    const [deletedTx] = await db
      .delete(transactions)
      .where(eq(transactions.id, id as string))
      .returning();

    if (!deletedTx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
