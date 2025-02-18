import { drizzle, Client } from 'drizzle-orm/libsql';

// Типизация параметров для подключения
interface ConnectionConfig {
  url: string | undefined;
  authToken: string | undefined;
}

// Подключение к базе данных
const db = drizzle({
  client: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  } as Client,
});

export default db;
