import 'dotenv/config';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required');
}

const isNeonLocal =
  process.env.NEON_LOCAL === 'true' || Boolean(process.env.DATABASE_FETCH_ENDPOINT);

if (isNeonLocal) {
  neonConfig.fetchEndpoint =
    process.env.DATABASE_FETCH_ENDPOINT || 'http://localhost:5432/sql';
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(databaseUrl);

const db = drizzle(sql);

export { sql, db };
