import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import * as schema from './schema';

const DATABASE_URL = 'sqlite.db';
const sqlite = new Database(DATABASE_URL);

export const db = drizzle(sqlite, { schema });
