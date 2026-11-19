import axios from 'axios'

import { env } from '@/shared/config/env'

const clientConfig = {
  baseURL: env.apiBaseUrl || undefined,
  headers: {
    Accept: 'application/json',
  },
  timeout: 15_000,
  withCredentials: true,
} as const

export const apiClient = axios.create(clientConfig)

export const sessionClient = axios.create(clientConfig)
