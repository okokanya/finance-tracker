import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { db } from './db';

const main = () => {
  try {
    migrate(db, { migrationsFolder: 'src/db/migrations' });
    console.log('Migrating...');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
