// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/libsql';
// // You can specify any property from the libsql connection options
// const db = drizzle({
//   connection: {
//     url: 'libsql://finance-tracker-finance-tracker.turso.io',
//     authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiJkZDZmMWY2Ni0wNmE5LTQ4ZDktYjAyOC1iNmQwMWQ3OWE2NjgiLCJpYXQiOjE3Mzg2NDM1ODN9.i464trP1W4jBdBENAjDdwDjqyohnCOW-aNa37vCmvPU3lszXTB6I2Szp7N6_3-igBncq5ssMrTMOTdTvSMj2Cw'
//   }
// });
// export default db;
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { users } from './schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

export const db = drizzle(client);
