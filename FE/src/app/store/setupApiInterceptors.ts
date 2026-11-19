import { queryClient } from '@/app/query/queryClient'
import { store } from '@/app/store/store'
import { identityService } from '@/features/identity/api/identityService'
import { identityKeys } from '@/features/identity/hooks/identityKeys'
import { sessionCleared, tokenRefreshed } from '@/features/identity/store/authSlice'
import { apiClient } from '@/shared/api/client'
import { installAuthInterceptors } from '@/shared/api/interceptors'

let cleanupInterceptors: (() => void) | undefined

export function setupApiInterceptors() {
  cleanupInterceptors?.()
  cleanupInterceptors = installAuthInterceptors({
    client: apiClient,
    getAccessToken: () => store.getState().auth.accessToken,
    onSessionExpired: () => {
      store.dispatch(sessionCleared())
      queryClient.removeQueries({ queryKey: identityKeys.all })
    },
    onTokenRefreshed: (accessToken) => {
      store.dispatch(tokenRefreshed(accessToken))
    },
    refreshAccessToken: identityService.refresh,
  })
}
