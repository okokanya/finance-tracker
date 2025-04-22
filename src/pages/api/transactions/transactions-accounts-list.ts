import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db';
import { accounts } from '@/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end(); // Метод не разрешён
  }

  try {
    const result = await db
      .select({ name: accounts.name })
      .from(accounts);

    const accountNames = result.map((acc) => acc.name);

    return res.status(200).json(accountNames);
  } catch (error) {
    console.error('Ошибка при получении счетов:', error);
    return res.status(500).json({ error: 'Ошибка при получении счетов' });
  }
}

