import type { NextApiRequest, NextApiResponse } from 'next';

import { db } from '@/db/db';
import { users } from '@/db/schema';
import { User, userSchema } from '@/models';

type ResponseData = {
  message: string;
  users: User[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const data = await db.select().from(users);
  res.status(200).json({
    message: 'эндпоинт на проверку токена и получение данных текущего пользователя',
    users: userSchema.array().parse(data),
  });
}
