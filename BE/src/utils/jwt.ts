import jwt, { type JwtPayload } from 'jsonwebtoken';
import { getEnv } from '../configs/env';
import { isRoleCode, type RoleCode } from '../constants/roles';
import { ApiError } from './api-error';

export interface AccessTokenClaims {
    sub: string;
    roles: RoleCode[];
}

interface VerifiedJwtPayload extends JwtPayload {
    sub: string;
    roles: string[];
}

export function signAccessToken(claims: AccessTokenClaims): string {
    const env = getEnv();

    return jwt.sign({ roles: claims.roles }, env.JWT_ACCESS_SECRET, {
        subject: claims.sub,
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
        expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
        algorithm: 'HS256',
    });
}

export function verifyAccessToken(token: string): AccessTokenClaims {
    const env = getEnv();

    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, {
            issuer: env.JWT_ISSUER,
            audience: env.JWT_AUDIENCE,
            algorithms: ['HS256'],
        });

        if (
            typeof payload === 'string' ||
            typeof payload.sub !== 'string' ||
            !Array.isArray(payload.roles) ||
            !payload.roles.every((role): role is RoleCode => typeof role === 'string' && isRoleCode(role))
        ) {
            throw new Error('JWT payload không hợp lệ');
        }

        return { sub: payload.sub, roles: payload.roles } satisfies AccessTokenClaims;
    } catch {
        throw new ApiError(401, 'INVALID_ACCESS_TOKEN', 'Access token không hợp lệ hoặc đã hết hạn');
    }
}
