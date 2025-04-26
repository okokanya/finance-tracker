import type { NextApiRequest, NextApiResponse } from 'next';
import { and, eq } from 'drizzle-orm'; // and для нескольких условий
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { transactionSchema } from '@/models';
import jwt from 'jsonwebtoken'; // npm install jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET!; // обязательно должен быть в .env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return await GET(req, res);
    default:
      return res.status(405).end();
  }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1. Получаем токен из кук
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Необходима авторизация' });
    }

    // 2. Декодируем токен
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (error) {
      console.error('Ошибка верификации токена:', error);
      return res.status(401).json({ error: 'Неверный токен' });
    }

    const userId = decoded.id;

    if (!userId) {
      return res.status(400).json({ error: 'Проблема с токеном' });
    }

    // 3. Фильтрация
    const { accountId } = req.query;

    const data = accountId
      ? await db
          .select()
          .from(transactions)
          .where(and(
            eq(transactions.accountId, String(accountId)),
            eq(transactions.userId, userId) // доп фильтр по userId
          ))
      : await db
          .select()
          .from(transactions)
          .where(eq(transactions.userId, userId)); // просто по userId

    const parsedData = transactionSchema.array().parse(data);

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
}
