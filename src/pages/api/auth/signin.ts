import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

import { db } from '@/db';
import { users } from '@/db/schema';
import { PROFILE_COOKIE_VALUE, PROFILE_KEY, TOKEN_KEY } from '@/features/profile/profile.constants';
import { User } from '@/features/profile/profile.types';

const SECRET_KEY = process.env.JWT_SECRET!;

type ResponseData = {
  message: string;
  user?: User;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      console.log('Полученный email:', email);

      // Нормализуем email
      const normalizedEmail = String(email).trim().toLowerCase();
      console.log('Нормализованный email:', normalizedEmail);

      // Ищем пользователя в базе по email
      let user;
      try {
        user = await db.select().from(users).where(eq(users.email, normalizedEmail)).limit(1);
      } catch (dbError) {
        console.error('Ошибка при запросе к базе данных:', dbError);
        return res.status(500).json({ message: 'Ошибка при подключении к базе данных' });
      }

      console.log('Результат поиска пользователя:', user);

      if (!user || user.length === 0) {
        console.log('Пользователь не найден.');
        return res
          .status(401)
          .json({ message: 'Пользователь не найден. Неверный email или пароль' });
      }

      console.log('Проверяем пароль:', password);
      console.log('Хэш пароля из базы:', user[0].password);

      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
        console.log('Пароль не совпадает.');
        return res.status(401).json({ message: 'Пароль не совпадает. Неверный email или пароль' });
      }

      // Генерация JWT токена с только id пользователя
      const token = jwt.sign({ id: user[0].id }, SECRET_KEY, { expiresIn: '7d' });

      console.log('JWT Token:', token);

      // Устанавливаем куки
      const maxAge = 60 * 60 * 24 * 7;
      res.setHeader('Set-Cookie', `${TOKEN_KEY}=${token}; HttpOnly; Path=/; Max-Age=${maxAge};`);
      res.appendHeader(
        'Set-Cookie',
        `${PROFILE_KEY}=${PROFILE_COOKIE_VALUE}; Path=/; Max-Age=${maxAge};`
      );

      const responseUser: User = {
        id: user[0].id,
        firstName: user[0].firstName,
        lastName: user[0].lastName,
        email: user[0].email,
        phone: user[0].phone,
        avatar: user[0].avatar,
      };

      // Возвращаем успешный ответ с токеном и сообщением
      return res.status(200).json({ message: 'Авторизация успешна', user: responseUser });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
