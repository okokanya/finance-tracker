import { migrate } from 'drizzle-orm/libsql/migrator';

import { db } from './db';

const main = async (): Promise<void> => {
  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
