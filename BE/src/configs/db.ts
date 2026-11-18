import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../db/drizzle/schema';
import * as relations from '../db/drizzle/relations';
import { getEnv } from './env';

const env = getEnv();

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
    ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined,
    max: 10,
});

export const db = drizzle(pool, { schema: { ...schema, ...relations } });
