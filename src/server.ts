import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { sql } from 'drizzle-orm';
import { db } from './configs/db';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // 1. Kiểm tra kết nối tới NeonDB
        await db.execute(sql`SELECT 1`);
        console.log('✅ Kết nối NeonDB thành công!');

        // 2. Lắng nghe HTTP server
        const server = app.listen(PORT, () => {
            console.log(`🌸 BloomCraft server đang chạy tại: http://localhost:${PORT}`);
            console.log(`🔍 Health check: http://localhost:${PORT}/health`);
        });

        // 3. Xử lý tắt server an toàn (Graceful shutdown)
        const shutdown = () => {
            console.log('\nĐang dừng server...');
            server.close(() => {
                console.log('Server đã dừng hoàn tất.');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (error) {
        console.error('❌ Không thể khởi động server do lỗi kết nối DB:', error);
        process.exit(1);
    }
}

startServer();