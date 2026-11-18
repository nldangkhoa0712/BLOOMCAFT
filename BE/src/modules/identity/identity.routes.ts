import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import {
    loginRateLimiter,
    refreshRateLimiter,
    registerRateLimiter,
} from '../../middlewares/rate-limit.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/async-handler';
import * as controller from './identity.controller';
import { loginSchema, registerSchema, updateProfileSchema } from './identity.schema';

export const identityRoutes: Router = Router();

identityRoutes.post('/register', registerRateLimiter, validateBody(registerSchema), asyncHandler(controller.register));
identityRoutes.post('/login', loginRateLimiter, validateBody(loginSchema), asyncHandler(controller.login));
identityRoutes.post('/refresh', refreshRateLimiter, asyncHandler(controller.refresh));
identityRoutes.post('/logout', asyncHandler(controller.logout));
identityRoutes.get('/profile', authenticate, asyncHandler(controller.getProfile));
identityRoutes.patch(
    '/profile',
    authenticate,
    validateBody(updateProfileSchema),
    asyncHandler(controller.updateProfile),
);
