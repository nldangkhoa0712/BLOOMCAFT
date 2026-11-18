import { describe, expect, it } from 'vitest';
import { registerSchema, updateProfileSchema } from '../../src/modules/identity/identity.schema';

describe('identity schemas', () => {
    it('chuẩn hóa email và chấp nhận mật khẩu đúng policy', () => {
        const result = registerSchema.parse({
            email: '  TEST.User@Example.com ',
            password: 'Valid@123',
            fullName: 'TEST User',
        });

        expect(result.email).toBe('test.user@example.com');
    });

    it.each(['short', 'lowercase@1', 'UPPERCASE@1', 'NoSpecial123', 'NoNumber@Test']) (
        'từ chối mật khẩu không hợp lệ: %s',
        (password) => {
            expect(() =>
                registerSchema.parse({ email: 'test@example.com', password, fullName: 'TEST User' }),
            ).toThrow();
        },
    );

    it('từ chối field profile ngoài allowlist', () => {
        expect(() => updateProfileSchema.parse({ fullName: 'TEST User', email: 'other@example.com' })).toThrow();
    });
});
