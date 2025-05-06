import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { transactions, accounts, categories } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

type UpdateTransactionRequest = {
  accountName: string;
  categoryName: string;
  amount: number;
  comment: string | null;
  date: string; // DD.MM.YYYY
  type?: 'topup' | 'withdrawal' | 'transfer'; // Ограничиваем допустимые значения
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      accountName,
      categoryName,
      amount,
      comment,
      date,
      type
    } = req.body as UpdateTransactionRequest;

    // Находим ID счета и категории по именам
    const [account] = await db
      .select({ id: accounts.id })
      .from(accounts)
      .where(eq(accounts.name, accountName))
      .limit(1);

    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, categoryName))
      .limit(1);

    if (!account || !category) {
      return res.status(404).json({ error: 'Account or category not found' });
    }

    // Конвертируем дату в формат SQLite
    const [day, month, year] = date.split('.');
    const dateString = `${year}-${month}-${day}`;

    // Обновляем транзакцию
    const [updatedTransaction] = await db
      .update(transactions)
      .set({
        accountId: account.id,
        categoryId: category.id,
        amount,
        comment,
        createdAt: sql`strftime('%s', ${dateString})`,
        type: type ?? 'withdrawal' // Используем ?? вместо || для большей ясности
      })
      .where(eq(transactions.id, id as string))
      .returning();

    return res.status(200).json({
      success: true,
      transaction: {
        ...updatedTransaction,
        accountName,
        categoryName,
        date: `${day}.${month}.${year}`
      }
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
