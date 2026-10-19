import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as schema from '../db/schema'; // Thư mục chứa schema được sinh từ bước pull

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Bắt buộc khi kết nối tới NeonDB
    },
    max: 10, // Giới hạn connection pool
});

export const db = drizzle(pool, { schema });