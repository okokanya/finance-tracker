import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';

import { db } from '@/db';
import { users } from '@/db/schema';
import { createUserSchema } from '@/models';

type ResponseData = {
  message: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      // валидируем данные, чтобы соответствовали модели создания пользователя
      const userData = createUserSchema.parse(req.body);

      // Хэшируем пароль перед сохранением
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = {
        ...userData,
        password: hashedPassword, // заменяем пароль на хеш
      };

      await db.insert(users).values(newUser);

      // Перенаправление на страницу auth/me после успешной регистрации
      res.setHeader('Location', '/auth/me');
      res.status(302).end(); // Статус 302 — временное перенаправление
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Ошибка валидации:', error);

        // если валидация не прошла, возвращаем ошибку
        if ('message' in error) {
          return res.status(400).json({ message: error.message });
        }

        return res
          .status(400)
          .json({ message: 'Ошибка валидации, проверьте правильность введенных данных' });
      }

      console.error('Ошибка при добавлении данных в базу:', error);
      res.status(500).json({ message: 'Произошла ошибка при регистрации' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
