import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';


export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: 'libsql://finance-tracker-finance-tracker.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiJkZDZmMWY2Ni0wNmE5LTQ4ZDktYjAyOC1iNmQwMWQ3OWE2NjgiLCJpYXQiOjE3Mzg2NDM1ODN9.i464trP1W4jBdBENAjDdwDjqyohnCOW-aNa37vCmvPU3lszXTB6I2Szp7N6_3-igBncq5ssMrTMOTdTvSMj2Cw',
  },
});
