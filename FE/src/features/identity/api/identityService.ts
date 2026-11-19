import type { AxiosInstance } from 'axios'
import { z } from 'zod'

import type {
  LoginCommand,
  LoginResult,
  RegisterCommand,
  IdentityProfile,
  UpdateProfileCommand,
} from '@/features/identity/types/identity'
import { apiClient, sessionClient } from '@/shared/api/client'
import { apiSuccessSchema, statusSuccessSchema } from '@/shared/api/contracts'
import { normalizeApiError } from '@/shared/api/errors'

const identityProfileSchema = z.object({
  avatarUrl: z.string().url().nullable(),
  email: z.string().email(),
  fullName: z.string(),
  id: z.string().uuid(),
  phone: z.string().nullable(),
  roles: z.array(z.enum(['ADMIN', 'CUSTOMER', 'FLORIST'])),
})

const loginResponseSchema = apiSuccessSchema(
  z.object({
    accessToken: z.string().min(1),
    profile: identityProfileSchema,
  }),
)

const profileResponseSchema = apiSuccessSchema(identityProfileSchema)

const refreshResponseSchema = apiSuccessSchema(
  z.object({
    accessToken: z.string().min(1),
  }),
)

export function createIdentityService(
  client: AxiosInstance,
  authSessionClient: AxiosInstance = client,
) {
  return {
    async getProfile(): Promise<IdentityProfile> {
      try {
        const response = await client.get('/api/v1/identity/profile')
        return profileResponseSchema.parse(response.data).data
      } catch (error) {
        throw normalizeApiError(error)
      }
    },

    async login(command: LoginCommand): Promise<LoginResult> {
      try {
        const response = await client.post('/api/v1/identity/login', command, {
          skipAuth: true,
          skipAuthRefresh: true,
        })
        return loginResponseSchema.parse(response.data).data
      } catch (error) {
        throw normalizeApiError(error)
      }
    },

    async register(command: RegisterCommand): Promise<void> {
      const request = {
        email: command.email,
        fullName: command.fullName,
        password: command.password,
      }

      try {
        const response = await client.post('/api/v1/identity/register', request, {
          skipAuth: true,
          skipAuthRefresh: true,
        })
        statusSuccessSchema.parse(response.data)
      } catch (error) {
        throw normalizeApiError(error)
      }
    },

    async refresh(): Promise<string> {
      try {
        const response = await authSessionClient.post('/api/v1/identity/refresh')
        return refreshResponseSchema.parse(response.data).data.accessToken
      } catch (error) {
        throw normalizeApiError(error)
      }
    },

    async logout(): Promise<void> {
      try {
        const response = await authSessionClient.post('/api/v1/identity/logout')
        statusSuccessSchema.parse(response.data)
      } catch (error) {
        throw normalizeApiError(error)
      }
    },

    async updateProfile(command: UpdateProfileCommand): Promise<IdentityProfile> {
      try {
        const response = await client.patch('/api/v1/identity/profile', {
          fullName: command.fullName,
          phone: command.phone.trim() || null,
        })
        return profileResponseSchema.parse(response.data).data
      } catch (error) {
        throw normalizeApiError(error)
      }
    },
  }
}

export const identityService = createIdentityService(apiClient, sessionClient)
