import axios, { AxiosError } from 'axios'
import { describe, expect, it, vi } from 'vitest'

import { installAuthInterceptors } from '@/shared/api/interceptors'

describe('installAuthInterceptors', () => {
  it('gắn access token vào request thông thường', async () => {
    const client = axios.create({
      adapter: async (config) => ({
        config,
        data: { success: true },
        headers: {},
        status: 200,
        statusText: 'OK',
      }),
    })
    installAuthInterceptors({
      client,
      getAccessToken: () => 'access-token',
      onSessionExpired: vi.fn(),
      onTokenRefreshed: vi.fn(),
      refreshAccessToken: vi.fn(),
    })

    const response = await client.get('/api/v1/identity/profile')

    expect(response.config.headers.Authorization).toBe('Bearer access-token')
  })

  it('chỉ refresh một lần khi nhiều request đồng thời nhận 401', async () => {
    let accessToken = 'expired-token'
    const client = axios.create({
      adapter: async (config) => {
        if (config.headers.Authorization !== 'Bearer refreshed-token') {
          throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
            config,
            data: { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token hết hạn' } },
            headers: {},
            status: 401,
            statusText: 'Unauthorized',
          })
        }

        return {
          config,
          data: { success: true },
          headers: {},
          status: 200,
          statusText: 'OK',
        }
      },
    })
    const refreshAccessToken = vi.fn(async () => 'refreshed-token')
    installAuthInterceptors({
      client,
      getAccessToken: () => accessToken,
      onSessionExpired: vi.fn(),
      onTokenRefreshed: (token) => {
        accessToken = token
      },
      refreshAccessToken,
    })

    await Promise.all([client.get('/one'), client.get('/two')])

    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
  })

  it('chỉ retry request gốc một lần', async () => {
    let requestCount = 0
    const client = axios.create({
      adapter: async (config) => {
        requestCount += 1
        throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
          config,
          data: { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token hết hạn' } },
          headers: {},
          status: 401,
          statusText: 'Unauthorized',
        })
      },
    })
    installAuthInterceptors({
      client,
      getAccessToken: () => 'expired-token',
      onSessionExpired: vi.fn(),
      onTokenRefreshed: vi.fn(),
      refreshAccessToken: vi.fn(async () => 'refreshed-token'),
    })

    await expect(client.get('/protected')).rejects.toMatchObject({
      response: { status: 401 },
    })
    expect(requestCount).toBe(2)
  })

  it('xóa session khi refresh thất bại', async () => {
    const client = axios.create({
      adapter: async (config) => {
        throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, {
          config,
          data: { success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token hết hạn' } },
          headers: {},
          status: 401,
          statusText: 'Unauthorized',
        })
      },
    })
    const onSessionExpired = vi.fn()
    installAuthInterceptors({
      client,
      getAccessToken: () => 'expired-token',
      onSessionExpired,
      onTokenRefreshed: vi.fn(),
      refreshAccessToken: vi.fn(async () => {
        throw new Error('Refresh failed')
      }),
    })

    await expect(client.get('/protected')).rejects.toThrow('Refresh failed')
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })
})
