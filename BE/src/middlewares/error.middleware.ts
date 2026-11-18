import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error';

export const notFoundHandler: RequestHandler = (request, _response, next) => {
    next(new ApiError(404, 'ROUTE_NOT_FOUND', `Không tìm thấy route ${request.method} ${request.path}`));
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
    if (error instanceof ZodError) {
        response.status(422).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Dữ liệu yêu cầu không hợp lệ',
                details: {
                    issues: error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                },
            },
        });
        return;
    }

    if (error instanceof ApiError) {
        response.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                ...(error.details ? { details: error.details } : {}),
            },
        });
        return;
    }

    console.error(error);
    response.status(500).json({
        success: false,
        error: { code: 'INTERNAL_SERVER_ERROR', message: 'Đã xảy ra lỗi nội bộ' },
    });
};
