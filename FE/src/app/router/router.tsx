import { createBrowserRouter } from 'react-router-dom'

import { NotFoundPage } from '@/features/errors/pages/NotFoundPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { LoginPage } from '@/features/identity/pages/LoginPage'
import { ProfilePage } from '@/features/identity/pages/ProfilePage'
import { RegisterPage } from '@/features/identity/pages/RegisterPage'
import { GuestRoute } from '@/features/identity/routes/GuestRoute'
import { ProtectedRoute } from '@/features/identity/routes/ProtectedRoute'
import { AppLayout } from '@/shared/layouts/AppLayout'

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'account/profile',
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
