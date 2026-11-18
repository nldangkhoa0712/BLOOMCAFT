import type { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { authorizeRoles } from '../../src/middlewares/auth.middleware';
import { ApiError } from '../../src/utils/api-error';

describe('authorizeRoles', () => {
    it('cho phép role phù hợp', () => {
        const request = { auth: { userId: 'user-id', roles: ['ADMIN'] } } as unknown as Request;
        const next = vi.fn();
        authorizeRoles('ADMIN')(request, {} as Response, next as NextFunction);
        expect(next).toHaveBeenCalledWith();
    });

    it('trả forbidden khi role không phù hợp', () => {
        const request = { auth: { userId: 'user-id', roles: ['CUSTOMER'] } } as unknown as Request;
        const next = vi.fn();
        authorizeRoles('ADMIN')(request, {} as Response, next as NextFunction);
        expect(next.mock.calls[0]?.[0]).toBeInstanceOf(ApiError);
        expect((next.mock.calls[0]?.[0] as ApiError).statusCode).toBe(403);
    });
});
