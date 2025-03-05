import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const SECRET_KEY = process.env.JWT_SECRET!;

type ResponseData = {
  message: string;
  token?: string;
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
        return res.status(401).json({ message: 'Пользователь не найден. Неверный email или пароль' });
      }

      console.log('Проверяем пароль:', password);
      console.log('Хэш пароля из базы:', user[0].password);

      const validPassword = await bcrypt.compare(password, user[0].password);
      if (!validPassword) {
        console.log('Пароль не совпадает.');
        return res.status(401).json({ message: 'Пароль не совпадает. Неверный email или пароль' });
      }

      // Генерация JWT токена с только id пользователя
      const token = jwt.sign(
        { id: user[0].id },
        SECRET_KEY,
        { expiresIn: '7d' }
      );

      console.log('JWT Token:', token);

      // Устанавливаем токен в куки
      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7};`);

      // Возвращаем успешный ответ с токеном и сообщением
      return res.status(200).json({ message: 'Авторизация успешна', token });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
