import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppSelector } from '@/app/store/hooks'

export function GuestRoute() {
  const location = useLocation()
  const status = useAppSelector((state) => state.auth.status)
  const routeState = location.state as { returnTo?: string } | null
  const returnTo =
    routeState?.returnTo?.startsWith('/') && !routeState.returnTo.startsWith('//')
      ? routeState.returnTo
      : '/'

  if (status === 'authenticated') return <Navigate replace to={returnTo} />
  return <Outlet />
}
