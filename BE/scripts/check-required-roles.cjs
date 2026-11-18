require('dotenv').config();
const { Client } = require('pg');

const requiredRoles = ['ADMIN', 'CUSTOMER', 'FLORIST'];

async function checkRequiredRoles() {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL là bắt buộc');

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        const result = await client.query('select code from identity.roles order by code');
        const existingRoles = new Set(result.rows.map((row) => row.code));
        const missingRoles = requiredRoles.filter((role) => !existingRoles.has(role));

        if (missingRoles.length > 0) {
            throw new Error(`Thiếu role bắt buộc: ${missingRoles.join(', ')}`);
        }

        console.log(`Đã xác nhận role: ${requiredRoles.join(', ')}`);
    } finally {
        await client.end();
    }
}

checkRequiredRoles().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
