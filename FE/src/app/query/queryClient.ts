import { QueryClient } from '@tanstack/react-query'

import { AppApiError } from '@/shared/api/errors'

function shouldRetry(failureCount: number, error: Error) {
  if (failureCount >= 1) return false
  if (!(error instanceof AppApiError)) return true
  return error.status === undefined || error.status >= 500
}

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: shouldRetry,
      staleTime: 30_000,
    },
  },
})
