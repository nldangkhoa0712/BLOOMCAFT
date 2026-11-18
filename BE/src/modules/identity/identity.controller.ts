import type { Request, Response } from 'express';
import { getEnv } from '../../configs/env';
import { ApiError } from '../../utils/api-error';
import { sendStatusSuccess, sendSuccess } from '../../utils/api-response';
import { readCookie } from '../../utils/cookies';
import * as identityService from './identity.service';
import type { LoginInput, RegisterInput, UpdateProfileInput } from './identity.schema';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_PATH = '/api/v1/identity';

function setRefreshCookie(response: Response, token: string): void {
    const env = getEnv();
    response.cookie(REFRESH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production' || env.COOKIE_SECURE,
        sameSite: 'lax',
        path: REFRESH_COOKIE_PATH,
        maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    });
}

export async function register(request: Request, response: Response): Promise<Response> {
    await identityService.register(request.body as RegisterInput);
    return sendStatusSuccess(response, 201);
}

export async function login(request: Request, response: Response): Promise<Response> {
    const result = await identityService.login(request.body as LoginInput);
    setRefreshCookie(response, result.refreshToken);
    return sendSuccess(response, { accessToken: result.accessToken, profile: result.profile });
}

export async function refresh(request: Request, response: Response): Promise<Response> {
    const currentRefreshToken = readCookie(request, REFRESH_COOKIE_NAME);
    if (!currentRefreshToken) {
        throw new ApiError(401, 'REFRESH_TOKEN_REQUIRED', 'Yêu cầu refresh token');
    }

    const result = await identityService.refresh(currentRefreshToken);
    setRefreshCookie(response, result.refreshToken);
    return sendSuccess(response, { accessToken: result.accessToken });
}

export async function logout(request: Request, response: Response): Promise<Response> {
    const refreshToken = readCookie(request, REFRESH_COOKIE_NAME);
    if (!refreshToken) throw new ApiError(401, 'REFRESH_TOKEN_REQUIRED', 'Yêu cầu refresh token');
    await identityService.logout(refreshToken);
    response.clearCookie(REFRESH_COOKIE_NAME, {
        httpOnly: true,
        secure: getEnv().NODE_ENV === 'production' || getEnv().COOKIE_SECURE,
        sameSite: 'lax',
        path: REFRESH_COOKIE_PATH,
    });
    return sendStatusSuccess(response);
}

export async function getProfile(request: Request, response: Response): Promise<Response> {
    if (!request.auth) throw new ApiError(401, 'AUTHENTICATION_REQUIRED', 'Yêu cầu xác thực');
    return sendSuccess(response, await identityService.getProfile(request.auth.userId));
}

export async function updateProfile(request: Request, response: Response): Promise<Response> {
    if (!request.auth) throw new ApiError(401, 'AUTHENTICATION_REQUIRED', 'Yêu cầu xác thực');
    return sendSuccess(
        response,
        await identityService.updateProfile(request.auth.userId, request.body as UpdateProfileInput),
    );
}
