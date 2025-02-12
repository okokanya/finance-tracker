import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { users } from './db/schema';
async function main() {
  const db = drizzle({
    connection: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!
    }
  });
  const user: typeof users.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
  };
  await db.insert(users).values(user);
  console.log('New user created!')
  const allUser = await db.select().from(users);
  console.log('Getting all users from the database: ', allUser)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */
  await db
    .update(users)
    .set({
      age: 31,
    })
    .where(eq(users.email, user.email));
  console.log('User info updated!')
  await db.delete(users).where(eq(users.email, user.email));
  console.log('User deleted!')
}
main();
