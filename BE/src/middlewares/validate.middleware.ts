import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export function validateBody(schema: ZodType): RequestHandler {
    return (request, _response, next) => {
        request.body = schema.parse(request.body);
        next();
    };
}

export function validateQuery(schema: ZodType): RequestHandler {
    return (request, _response, next) => {
        const parsedQuery = schema.parse(request.query);
        Object.defineProperty(request, 'query', { value: parsedQuery, configurable: true });
        next();
    };
}

export function validateParams(schema: ZodType): RequestHandler {
    return (request, _response, next) => {
        request.params = schema.parse(request.params) as Record<string, string>;
        next();
    };
}
