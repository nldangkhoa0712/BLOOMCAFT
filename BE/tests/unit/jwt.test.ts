import { describe, expect, it } from 'vitest';
import { signAccessToken, verifyAccessToken } from '../../src/utils/jwt';

describe('JWT access token', () => {
    it('ký và xác minh user id cùng roles', () => {
        const token = signAccessToken({ sub: '00000000-0000-0000-0000-000000000001', roles: ['CUSTOMER'] });
        expect(verifyAccessToken(token)).toEqual({
            sub: '00000000-0000-0000-0000-000000000001',
            roles: ['CUSTOMER'],
        });
    });

    it('từ chối token bị chỉnh sửa', () => {
        const token = signAccessToken({ sub: '00000000-0000-0000-0000-000000000001', roles: ['ADMIN'] });
        expect(() => verifyAccessToken(`${token}invalid`)).toThrow();
    });
});
