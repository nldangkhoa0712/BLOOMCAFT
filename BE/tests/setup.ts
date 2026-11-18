import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/bloomcraft_test';
process.env.JWT_ACCESS_SECRET ??= 'TEST_ONLY_SECRET_WITH_AT_LEAST_32_CHARACTERS';
process.env.JWT_ISSUER ??= 'bloomcraft-test';
process.env.JWT_AUDIENCE ??= 'bloomcraft-test-client';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
process.env.DATABASE_SSL ??= 'true';
