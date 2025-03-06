import { defineConfig } from 'drizzle-kit';

import './env-config';

const dialect = process.env.DATABASE_DIALECT! as
  | 'postgresql'
  | 'mysql'
  | 'sqlite'
  | 'turso'
  | 'singlestore';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: dialect,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
