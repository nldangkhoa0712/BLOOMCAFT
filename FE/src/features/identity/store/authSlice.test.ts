import { describe, expect, it } from 'vitest'

import authReducer, {
  sessionCleared,
  sessionAuthenticated,
  sessionInitializationFailed,
  sessionInitializationStarted,
  tokenRefreshed,
} from '@/features/identity/store/authSlice'

describe('authReducer', () => {
  it('chuyển session sang authenticated và giữ access token trong state', () => {
    const state = authReducer(undefined, sessionAuthenticated('access-token'))

    expect(state).toEqual({
      accessToken: 'access-token',
      status: 'authenticated',
    })
  })

  it('xóa token khi session kết thúc', () => {
    const authenticated = authReducer(undefined, sessionAuthenticated('access-token'))
    const state = authReducer(authenticated, sessionCleared())

    expect(state).toEqual({
      accessToken: null,
      status: 'unauthenticated',
    })
  })

  it('giữ đúng trạng thái trong vòng đời bootstrap', () => {
    const withToken = authReducer(undefined, tokenRefreshed('refreshed-token'))
    expect(withToken).toEqual({
      accessToken: 'refreshed-token',
      status: 'initializing',
    })

    const failed = authReducer(withToken, sessionInitializationFailed())
    expect(failed).toEqual({
      accessToken: null,
      status: 'initialization-error',
    })

    expect(authReducer(failed, sessionInitializationStarted())).toEqual({
      accessToken: null,
      status: 'initializing',
    })
  })
})
