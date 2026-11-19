import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppSelector } from '@/app/store/hooks'

export function ProtectedRoute() {
  const location = useLocation()
  const status = useAppSelector((state) => state.auth.status)

  if (status !== 'authenticated') {
    const returnTo = `${location.pathname}${location.search}${location.hash}`
    return <Navigate replace state={{ returnTo }} to="/login" />
  }

  return <Outlet />
}
