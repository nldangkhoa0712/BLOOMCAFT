import 'dotenv/config';
import { z } from 'zod';

const booleanFromString = z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true');

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().max(65535).default(5000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL là bắt buộc'),
    JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET phải có ít nhất 32 ký tự'),
    JWT_ISSUER: z.string().min(1, 'JWT_ISSUER là bắt buộc'),
    JWT_AUDIENCE: z.string().min(1, 'JWT_AUDIENCE là bắt buộc'),
    ACCESS_TOKEN_TTL_SECONDS: z.coerce.number().int().positive().default(900),
    REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(30),
    CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
    COOKIE_SECURE: booleanFromString,
    DATABASE_SSL: z
        .enum(['true', 'false'])
        .default('true')
        .transform((value) => value === 'true'),
    REGISTER_RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().default(5),
    LOGIN_RATE_LIMIT_PER_15_MINUTES: z.coerce.number().int().positive().default(10),
    REFRESH_RATE_LIMIT_PER_15_MINUTES: z.coerce.number().int().positive().default(30),
});

export type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | undefined;

export function getEnv(): AppEnv {
    if (!cachedEnv) {
        const result = envSchema.safeParse(process.env);

        if (!result.success) {
            const details = result.error.issues
                .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                .join('; ');
            throw new Error(`Cấu hình môi trường không hợp lệ: ${details}`);
        }

        cachedEnv = result.data;
    }

    return cachedEnv;
}

export function resetEnvCacheForTests(): void {
    cachedEnv = undefined;
}
