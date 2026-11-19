import { configureStore } from '@reduxjs/toolkit'

import authReducer from '@/features/identity/store/authSlice'

const redactAuthToken = <State,>(state: State): State => {
  const candidate = state as { auth?: { accessToken?: string | null } }
  if (!candidate.auth) return state

  return {
    ...candidate,
    auth: {
      ...candidate.auth,
      accessToken: candidate.auth.accessToken ? '[REDACTED]' : null,
    },
  } as State
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.DEV
    ? {
        actionSanitizer: (action) => {
          if (
            typeof action === 'object' &&
            action !== null &&
            'type' in action &&
            typeof action.type === 'string' &&
            /sessionAuthenticated|tokenRefreshed/.test(action.type)
          ) {
            return { ...action, payload: '[REDACTED]' }
          }

          return action
        },
        stateSanitizer: redactAuthToken,
      }
    : false,
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
