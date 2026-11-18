import { rateLimit } from 'express-rate-limit';
import { getEnv } from '../configs/env';

function createLimiter(windowMs: number, limit: number) {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        handler: (_request, response) => {
            response.status(429).json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau',
                },
            });
        },
    });
}

const env = getEnv();

export const registerRateLimiter = createLimiter(60 * 60 * 1000, env.REGISTER_RATE_LIMIT_PER_HOUR);
export const loginRateLimiter = createLimiter(15 * 60 * 1000, env.LOGIN_RATE_LIMIT_PER_15_MINUTES);
export const refreshRateLimiter = createLimiter(15 * 60 * 1000, env.REFRESH_RATE_LIMIT_PER_15_MINUTES);
