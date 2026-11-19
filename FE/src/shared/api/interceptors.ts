import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'

interface AuthRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  skipAuth?: boolean
  skipAuthRefresh?: boolean
}

interface AuthInterceptorOptions {
  client: AxiosInstance
  getAccessToken: () => string | null
  onSessionExpired: () => void
  onTokenRefreshed: (accessToken: string) => void
  refreshAccessToken: () => Promise<string>
}

export function installAuthInterceptors({
  client,
  getAccessToken,
  onSessionExpired,
  onTokenRefreshed,
  refreshAccessToken,
}: AuthInterceptorOptions) {
  let refreshPromise: Promise<string> | null = null

  const getRefreshedToken = () => {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken()
        .then((accessToken) => {
          onTokenRefreshed(accessToken)
          return accessToken
        })
        .catch((error: unknown) => {
          onSessionExpired()
          throw error
        })
        .finally(() => {
          refreshPromise = null
        })
    }

    return refreshPromise
  }

  const requestInterceptorId = client.interceptors.request.use((config) => {
    const authConfig = config as AuthRequestConfig
    const accessToken = getAccessToken()

    if (accessToken && !authConfig.skipAuth) {
      authConfig.headers.Authorization = `Bearer ${accessToken}`
    }

    return authConfig
  })

  const responseInterceptorId = client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error)) throw error

      const authConfig = error.config as AuthRequestConfig | undefined
      const shouldRefresh =
        error.response?.status === 401 &&
        authConfig &&
        !authConfig._retry &&
        !authConfig.skipAuthRefresh

      if (!shouldRefresh) throw error

      authConfig._retry = true
      const accessToken = await getRefreshedToken()
      authConfig.headers.Authorization = `Bearer ${accessToken}`
      return client.request(authConfig)
    },
  )

  return () => {
    client.interceptors.request.eject(requestInterceptorId)
    client.interceptors.response.eject(responseInterceptorId)
  }
}
