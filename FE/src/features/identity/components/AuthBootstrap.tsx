import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, type PropsWithChildren } from 'react'

import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import { identityService } from '@/features/identity/api/identityService'
import { SessionErrorScreen } from '@/features/identity/components/SessionErrorScreen'
import { SessionLoadingScreen } from '@/features/identity/components/SessionLoadingScreen'
import { identityKeys } from '@/features/identity/hooks/identityKeys'
import { profileQueryOptions } from '@/features/identity/hooks/profileQuery'
import {
  sessionAuthenticated,
  sessionCleared,
  sessionInitializationFailed,
  sessionInitializationStarted,
  tokenRefreshed,
} from '@/features/identity/store/authSlice'
import { AppApiError } from '@/shared/api/errors'

export function AuthBootstrap({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const status = useAppSelector((state) => state.auth.status)
  const bootstrapStarted = useRef(false)

  const bootstrap = useCallback(async () => {
    dispatch(sessionInitializationStarted())

    try {
      const accessToken = await identityService.refresh()
      dispatch(tokenRefreshed(accessToken))
      await queryClient.fetchQuery(profileQueryOptions())
      dispatch(sessionAuthenticated(accessToken))
    } catch (error) {
      queryClient.removeQueries({ queryKey: identityKeys.all })
      if (error instanceof AppApiError && error.status === 401) {
        dispatch(sessionCleared())
        return
      }

      dispatch(sessionInitializationFailed())
    }
  }, [dispatch, queryClient])

  useEffect(() => {
    if (bootstrapStarted.current) return
    bootstrapStarted.current = true
    void bootstrap()
  }, [bootstrap])

  if (status === 'initializing') return <SessionLoadingScreen />
  if (status === 'initialization-error') {
    return (
      <SessionErrorScreen
        onRetry={() => {
          void bootstrap()
        }}
      />
    )
  }

  return children
}
