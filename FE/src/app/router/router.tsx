import { createBrowserRouter } from 'react-router-dom'

import { NotFoundPage } from '@/features/errors/pages/NotFoundPage'
import { HomePage } from '@/features/home/pages/HomePage'
import { AppLayout } from '@/shared/layouts/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
