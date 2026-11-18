import type { RoleCode } from '../constants/roles';

declare global {
    namespace Express {
        interface Request {
            auth?: {
                userId: string;
                roles: RoleCode[];
            };
        }
    }
}

export {};
