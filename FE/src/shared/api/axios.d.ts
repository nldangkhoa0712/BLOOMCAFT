import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
    skipAuth?: boolean
    skipAuthRefresh?: boolean
  }

  export interface InternalAxiosRequestConfig {
    _retry?: boolean
    skipAuth?: boolean
    skipAuthRefresh?: boolean
  }
}
