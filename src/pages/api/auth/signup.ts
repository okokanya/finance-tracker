import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import type { NextApiRequest, NextApiResponse } from 'next';
import { users } from '../../../db/schema';

// переписать на енв
const db = drizzle({
  connection: {
    url: 'libsql://finance-tracker-finance-tracker.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiJkZDZmMWY2Ni0wNmE5LTQ4ZDktYjAyOC1iNmQwMWQ3OWE2NjgiLCJpYXQiOjE3Mzg2NDM1ODN9.i464trP1W4jBdBENAjDdwDjqyohnCOW-aNa37vCmvPU3lszXTB6I2Szp7N6_3-igBncq5ssMrTMOTdTvSMj2Cw'
  }
});

type ResponseData = {
  message: string;
};

type RequestBody = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, password } = req.body as RequestBody;

    // Проверка, что все обязательные поля присутствуют
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    try {
      const newUser = {
        first_name: firstName,
        last_name: lastName,
        email,
        password, //потом захешировать пароль
      };

      await db.insert(users).values(newUser);

      // ответ
      res.status(200).json({ message: 'Регистрация прошла успешно!' });
    } catch (error) {
      console.error('Ошибка при добавлении данных в базу:', error);
      res.status(500).json({ message: 'Произошла ошибка при регистрации' });
    }
  } else {
    res.status(405).json({ message: 'Метод не разрешен' });
  }
}
