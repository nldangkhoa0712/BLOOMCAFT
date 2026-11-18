import type { Response } from 'express';

export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export function sendSuccess<T>(
    response: Response,
    data: T,
    options: { statusCode?: number; message?: string; meta?: PaginationMeta } = {},
): Response {
    const body: Record<string, unknown> = { success: true, data };

    if (options.message) body.message = options.message;
    if (options.meta) body.meta = options.meta;

    return response.status(options.statusCode ?? 200).json(body);
}

export function sendStatusSuccess(response: Response, statusCode = 200): Response {
    return response.status(statusCode).json({ success: true });
}
