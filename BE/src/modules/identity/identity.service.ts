import { getEnv } from '../../configs/env';
import { ApiError } from '../../utils/api-error';
import { hashPassword, verifyPassword } from '../../utils/hash-password';
import { signAccessToken } from '../../utils/jwt';
import { generateRefreshToken, hashRefreshToken } from '../../utils/refresh-token';
import * as repository from './identity.repository';
import type { LoginInput, RegisterInput, UpdateProfileInput } from './identity.schema';

const DUMMY_PASSWORD_HASH = '$2b$12$v3Y92JYsDHC3HGtrC6PrTux0AU5NTgFukQ1QEGQ8Z6q9kVj0jXl9K';

function refreshTokenExpiresAt(): string {
    const expiresAt = new Date();
    expiresAt.setUTCDate(expiresAt.getUTCDate() + getEnv().REFRESH_TOKEN_TTL_DAYS);
    return expiresAt.toISOString();
}

function isUniqueViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) return false;
    if ('code' in error && error.code === '23505') return true;
    return 'cause' in error && isUniqueViolation(error.cause);
}

export async function register(input: RegisterInput): Promise<void> {
    const passwordHash = await hashPassword(input.password);

    try {
        await repository.createCustomer(input, passwordHash);
    } catch (error) {
        if (isUniqueViolation(error)) {
            throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'Email đã được sử dụng');
        }
        throw error;
    }
}

export async function login(input: LoginInput) {
    const user = await repository.findUserForLogin(input.email);
    const passwordMatches = await verifyPassword(input.password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

    if (!user || !passwordMatches || user.status !== 'ACTIVE') {
        throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email hoặc mật khẩu không chính xác');
    }

    const refreshToken = generateRefreshToken();
    await repository.completeLogin(user.id, hashRefreshToken(refreshToken), refreshTokenExpiresAt());

    return {
        accessToken: signAccessToken({ sub: user.id, roles: user.roles }),
        refreshToken,
        profile: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            roles: user.roles,
        },
    };
}

export async function refresh(currentRefreshToken: string) {
    const refreshToken = generateRefreshToken();
    const session = await repository.rotateRefreshToken(
        hashRefreshToken(currentRefreshToken),
        hashRefreshToken(refreshToken),
        refreshTokenExpiresAt(),
    );

    return {
        accessToken: signAccessToken({ sub: session.userId, roles: session.roles }),
        refreshToken,
    };
}

export async function logout(refreshToken: string): Promise<void> {
    const revoked = await repository.revokeRefreshToken(hashRefreshToken(refreshToken));
    if (!revoked) throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token không hợp lệ');
}

export async function getProfile(userId: string) {
    const profile = await repository.findProfileById(userId);
    if (!profile) throw new ApiError(404, 'USER_NOT_FOUND', 'Không tìm thấy người dùng');
    return profile;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
    const profile = await repository.updateProfile(userId, input);
    if (!profile) throw new ApiError(404, 'USER_NOT_FOUND', 'Không tìm thấy người dùng');
    return profile;
}
