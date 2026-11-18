export const ROLE_CODES = ['CUSTOMER', 'ADMIN', 'FLORIST'] as const;

export type RoleCode = (typeof ROLE_CODES)[number];

export function isRoleCode(value: string): value is RoleCode {
    return ROLE_CODES.includes(value as RoleCode);
}
