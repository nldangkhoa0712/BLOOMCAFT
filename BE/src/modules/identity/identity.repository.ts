import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { db } from '../../configs/db';
import { isRoleCode, type RoleCode } from '../../constants/roles';
import {
    refreshTokensInIdentity,
    rolesInIdentity,
    userRolesInIdentity,
    usersInIdentity,
} from '../../db/drizzle/schema';
import { ApiError } from '../../utils/api-error';
import type { RegisterInput, UpdateProfileInput } from './identity.schema';

export interface IdentityUser {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    phone: string | null;
    avatarUrl: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface PublicProfile {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    avatarUrl: string | null;
    roles: RoleCode[];
}

function toRoleCodes(rows: { code: string }[]): RoleCode[] {
    return rows.map((row) => row.code).filter(isRoleCode);
}

async function findRolesByUserId(userId: string): Promise<RoleCode[]> {
    const rows = await db
        .select({ code: rolesInIdentity.code })
        .from(userRolesInIdentity)
        .innerJoin(rolesInIdentity, eq(userRolesInIdentity.roleId, rolesInIdentity.id))
        .where(eq(userRolesInIdentity.userId, userId));
    return toRoleCodes(rows);
}

export async function createCustomer(input: RegisterInput, passwordHash: string): Promise<void> {
    await db.transaction(async (transaction) => {
        const [existingUser] = await transaction
            .select({ id: usersInIdentity.id })
            .from(usersInIdentity)
            .where(sql`lower(${usersInIdentity.email}) = ${input.email}`)
            .limit(1);

        if (existingUser) throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'Email đã được sử dụng');

        const [customerRole] = await transaction
            .select({ id: rolesInIdentity.id })
            .from(rolesInIdentity)
            .where(eq(rolesInIdentity.code, 'CUSTOMER'))
            .limit(1);

        if (!customerRole) {
            throw new ApiError(500, 'CUSTOMER_ROLE_NOT_CONFIGURED', 'Role CUSTOMER chưa được cấu hình');
        }

        const [user] = await transaction
            .insert(usersInIdentity)
            .values({
                email: input.email,
                passwordHash,
                fullName: input.fullName,
                ...(input.phone ? { phone: input.phone } : {}),
                status: 'ACTIVE',
            })
            .returning({ id: usersInIdentity.id });

        if (!user) throw new ApiError(500, 'USER_CREATION_FAILED', 'Không thể tạo tài khoản');

        await transaction.insert(userRolesInIdentity).values({
            userId: user.id,
            roleId: customerRole.id,
        });
    });
}

export async function findUserForLogin(email: string): Promise<(IdentityUser & { roles: RoleCode[] }) | null> {
    const [user] = await db
        .select({
            id: usersInIdentity.id,
            email: usersInIdentity.email,
            passwordHash: usersInIdentity.passwordHash,
            fullName: usersInIdentity.fullName,
            phone: usersInIdentity.phone,
            avatarUrl: usersInIdentity.avatarUrl,
            status: usersInIdentity.status,
            createdAt: usersInIdentity.createdAt,
            updatedAt: usersInIdentity.updatedAt,
        })
        .from(usersInIdentity)
        .where(sql`lower(${usersInIdentity.email}) = ${email}`)
        .limit(1);

    if (!user) return null;
    return { ...user, roles: await findRolesByUserId(user.id) };
}

export async function completeLogin(
    userId: string,
    tokenHash: string,
    expiresAt: string,
): Promise<void> {
    await db.transaction(async (transaction) => {
        await transaction
            .update(usersInIdentity)
            .set({ lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
            .where(eq(usersInIdentity.id, userId));
        await transaction.insert(refreshTokensInIdentity).values({ userId, tokenHash, expiresAt });
    });
}

export async function rotateRefreshToken(
    currentTokenHash: string,
    newTokenHash: string,
    newExpiresAt: string,
): Promise<{ userId: string; roles: RoleCode[] }> {
    return db.transaction(async (transaction) => {
        const now = new Date().toISOString();
        const [revokedToken] = await transaction
            .update(refreshTokensInIdentity)
            .set({ revokedAt: now })
            .where(
                and(
                    eq(refreshTokensInIdentity.tokenHash, currentTokenHash),
                    isNull(refreshTokensInIdentity.revokedAt),
                    gt(refreshTokensInIdentity.expiresAt, now),
                ),
            )
            .returning({ userId: refreshTokensInIdentity.userId });

        if (!revokedToken) {
            throw new ApiError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token không hợp lệ hoặc đã hết hạn');
        }

        const [user] = await transaction
            .select({ id: usersInIdentity.id, status: usersInIdentity.status })
            .from(usersInIdentity)
            .where(eq(usersInIdentity.id, revokedToken.userId))
            .limit(1);

        if (!user || user.status !== 'ACTIVE') {
            throw new ApiError(403, 'ACCOUNT_NOT_ACTIVE', 'Tài khoản không có quyền truy cập');
        }

        const roleRows = await transaction
            .select({ code: rolesInIdentity.code })
            .from(userRolesInIdentity)
            .innerJoin(rolesInIdentity, eq(userRolesInIdentity.roleId, rolesInIdentity.id))
            .where(eq(userRolesInIdentity.userId, user.id));

        await transaction.insert(refreshTokensInIdentity).values({
            userId: user.id,
            tokenHash: newTokenHash,
            expiresAt: newExpiresAt,
        });

        return { userId: user.id, roles: toRoleCodes(roleRows) };
    });
}

export async function revokeRefreshToken(tokenHash: string): Promise<boolean> {
    const revokedTokens = await db
        .update(refreshTokensInIdentity)
        .set({ revokedAt: new Date().toISOString() })
        .where(
            and(
                eq(refreshTokensInIdentity.tokenHash, tokenHash),
                isNull(refreshTokensInIdentity.revokedAt),
                gt(refreshTokensInIdentity.expiresAt, new Date().toISOString()),
            ),
        )
        .returning({ id: refreshTokensInIdentity.id });
    return revokedTokens.length > 0;
}

export async function findProfileById(userId: string): Promise<PublicProfile | null> {
    const [user] = await db
        .select({
            id: usersInIdentity.id,
            email: usersInIdentity.email,
            fullName: usersInIdentity.fullName,
            phone: usersInIdentity.phone,
            avatarUrl: usersInIdentity.avatarUrl,
        })
        .from(usersInIdentity)
        .where(eq(usersInIdentity.id, userId))
        .limit(1);

    if (!user) return null;
    return { ...user, roles: await findRolesByUserId(user.id) };
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<PublicProfile | null> {
    const values: { fullName?: string; phone?: string | null; avatarUrl?: string | null; updatedAt: string } = {
        updatedAt: new Date().toISOString(),
    };
    if (input.fullName !== undefined) values.fullName = input.fullName;
    if (input.phone !== undefined) values.phone = input.phone;
    if (input.avatarUrl !== undefined) values.avatarUrl = input.avatarUrl;

    await db.update(usersInIdentity).set(values).where(eq(usersInIdentity.id, userId));
    return findProfileById(userId);
}
