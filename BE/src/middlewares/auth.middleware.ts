import type { RequestHandler } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../configs/db';
import type { RoleCode } from '../constants/roles';
import { usersInIdentity } from '../db/drizzle/schema';
import { ApiError } from '../utils/api-error';
import { verifyAccessToken } from '../utils/jwt';

export const authenticate: RequestHandler = async (request, _response, next) => {
    try {
        const authorization = request.headers.authorization;
        if (!authorization?.startsWith('Bearer ')) {
            throw new ApiError(401, 'AUTHENTICATION_REQUIRED', 'Yêu cầu access token');
        }

        const claims = verifyAccessToken(authorization.slice('Bearer '.length).trim());
        const [user] = await db
            .select({ id: usersInIdentity.id, status: usersInIdentity.status })
            .from(usersInIdentity)
            .where(eq(usersInIdentity.id, claims.sub))
            .limit(1);

        if (!user) throw new ApiError(401, 'INVALID_ACCESS_TOKEN', 'Access token không hợp lệ');
        if (user.status !== 'ACTIVE') {
            throw new ApiError(403, 'ACCOUNT_NOT_ACTIVE', 'Tài khoản không có quyền truy cập');
        }

        request.auth = { userId: user.id, roles: claims.roles };
        next();
    } catch (error) {
        next(error);
    }
};

export function authorizeRoles(...allowedRoles: RoleCode[]): RequestHandler {
    return (request, _response, next) => {
        if (!request.auth) {
            next(new ApiError(401, 'AUTHENTICATION_REQUIRED', 'Yêu cầu xác thực'));
            return;
        }

        if (!request.auth.roles.some((role) => allowedRoles.includes(role))) {
            next(new ApiError(403, 'FORBIDDEN', 'Bạn không có quyền thực hiện thao tác này'));
            return;
        }

        next();
    };
}
