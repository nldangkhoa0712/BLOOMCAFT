import type { Request } from 'express';

export function readCookie(request: Request, name: string): string | undefined {
    const cookieHeader = request.headers.cookie;
    if (!cookieHeader) return undefined;

    for (const cookie of cookieHeader.split(';')) {
        const separatorIndex = cookie.indexOf('=');
        if (separatorIndex < 0) continue;

        const key = cookie.slice(0, separatorIndex).trim();
        if (key === name) return decodeURIComponent(cookie.slice(separatorIndex + 1).trim());
    }

    return undefined;
}
