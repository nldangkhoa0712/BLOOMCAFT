import axios, { type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'

import { createIdentityService } from '@/features/identity/api/identityService'

describe('identityService', () => {
  it('đăng ký đúng endpoint mà không gửi confirmPassword', async () => {
    const requests: InternalAxiosRequestConfig[] = []
    const client = axios.create({
      adapter: async (config) => {
        requests.push(config)
        return {
          config,
          data: { success: true },
          headers: {},
          status: 201,
          statusText: 'Created',
        }
      },
    })
    const service = createIdentityService(client)

    await service.register({
      confirmPassword: 'Valid@123',
      email: 'customer@example.com',
      fullName: 'Bloom Customer',
      password: 'Valid@123',
    })

    expect(requests[0]?.url).toBe('/api/v1/identity/register')
    expect(JSON.parse(String(requests[0]?.data))).toEqual({
      email: 'customer@example.com',
      fullName: 'Bloom Customer',
      password: 'Valid@123',
    })
  })

  it('parse response đăng nhập thành domain result', async () => {
    const client = axios.create({
      adapter: async (config) => ({
        config,
        data: {
          success: true,
          data: {
            accessToken: 'access-token',
            profile: {
              avatarUrl: null,
              email: 'customer@example.com',
              fullName: 'Bloom Customer',
              id: 'b75659a2-2a83-47a5-93ad-37ebfd2224cf',
              phone: null,
              roles: ['CUSTOMER'],
            },
          },
        },
        headers: {},
        status: 200,
        statusText: 'OK',
      }),
    })
    const service = createIdentityService(client)

    const result = await service.login({
      email: 'customer@example.com',
      password: 'Valid@123',
    })

    expect(result).toEqual({
      accessToken: 'access-token',
      profile: {
        avatarUrl: null,
        email: 'customer@example.com',
        fullName: 'Bloom Customer',
        id: 'b75659a2-2a83-47a5-93ad-37ebfd2224cf',
        phone: null,
        roles: ['CUSTOMER'],
      },
    })
  })

  it('từ chối response đăng nhập sai contract', async () => {
    const client = axios.create({
      adapter: async (config) => ({
        config,
        data: { success: true, data: { profile: null } },
        headers: {},
        status: 200,
        statusText: 'OK',
      }),
    })
    const service = createIdentityService(client)

    await expect(
      service.login({ email: 'customer@example.com', password: 'Valid@123' }),
    ).rejects.toMatchObject({ code: 'UNKNOWN_ERROR' })
  })
})
