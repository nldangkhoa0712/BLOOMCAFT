import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type AuthStatus =
  | 'authenticated'
  | 'initialization-error'
  | 'initializing'
  | 'unauthenticated'

export interface AuthState {
  accessToken: string | null
  status: AuthStatus
}

const initialState: AuthState = {
  accessToken: null,
  status: 'initializing',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionInitializationFailed(state) {
      state.accessToken = null
      state.status = 'initialization-error'
    },
    sessionInitializationStarted(state) {
      state.accessToken = null
      state.status = 'initializing'
    },
    sessionCleared(state) {
      state.accessToken = null
      state.status = 'unauthenticated'
    },
    sessionAuthenticated(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      state.status = 'authenticated'
    },
    tokenRefreshed(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
  },
})

export const {
  sessionAuthenticated,
  sessionCleared,
  sessionInitializationFailed,
  sessionInitializationStarted,
  tokenRefreshed,
} = authSlice.actions

export default authSlice.reducer
