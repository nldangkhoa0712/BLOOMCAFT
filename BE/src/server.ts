import { sql } from 'drizzle-orm';
import app from './app';
import { db, pool } from './configs/db';
import { getEnv } from './configs/env';

async function startServer(): Promise<void> {
    const env = getEnv();

    try {
        await db.execute(sql`SELECT 1`);
        const server = app.listen(env.PORT, () => {
            console.log(`BloomCraft Backend đang chạy tại http://localhost:${env.PORT}`);
        });

        const shutdown = (signal: string) => {
            console.log(`Nhận ${signal}, đang dừng server...`);
            server.close(() => {
                void pool.end().finally(() => process.exit(0));
            });
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    } catch (error) {
        console.error('Không thể khởi động server:', error);
        await pool.end();
        process.exit(1);
    }
}

void startServer();
