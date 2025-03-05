import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db/db';
import { users } from '@/db/schema';

type ResponseData = {
  message: string;
  users: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const usersRes = await db.select().from(users);
  res.status(200).json({
    message: 'эндпоинт на проверку токена и получение данных текущего пользователя',
    users: usersRes,
  });
}
