import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

// Создаем подключение к SQLite
const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

const main = async (): Promise<void> => {
  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});