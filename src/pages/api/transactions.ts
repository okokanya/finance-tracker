import { eq } from 'drizzle-orm';
import { DateTime } from 'luxon';
import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db';
import { transactions } from '@/db/schema';
import { transactionSchema } from '@/models';
import { getUser } from '@/utils/get-user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    case 'POST':
      return await POST(req, res);
    default:
      return res.status(405).end();
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { accountId } = req.query;

    const data = accountId
      ? await db
          .select()
          .from(transactions)
          .where(eq(transactions.accountId, String(accountId)))
      : await db.select().from(transactions);

    const parsedData = transactionSchema.array().parse(data);
    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUser(req);

    // Валидация тела запроса
    const rawData = req.body;

    const parsedData = transactionSchema
      .omit({
        id: true,
        updatedAt: true,
        targetAccountId: true,
      })
      .parse({
        ...rawData,
        userId,
        createdAt: DateTime.fromObject({
          year: Number(rawData.year),
          month: Number(rawData.month),
          day: Number(rawData.day)
        }).toISO()
      });


    // Создание транзакции с автоматической генерацией полей
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        ...parsedData,
        updatedAt: new Date(),
      })
      .returning();

    // Повторная валидация результата
    const validatedTransaction = transactionSchema.parse(newTransaction);

    return res.status(201).json(validatedTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    return res.status(400).json({
      error: 'Invalid transaction data',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
