import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import RootLayout from '@/layouts/root-layout'
import HRAPage from '@/models/hra/pages/hra-page'
import SupportPage from '@/models/support/pages/support-page'
import SettingsPage from '@/models/settings/pages/settings-page'
import HraActivityPage from '@/models/hra-activity/pages/hra-activity-page'
import TestPage from '@/models/test/pages/test-page'
import ProtectedRoute from '@/base_submod/components/auth/protected-route'
import { useAuthStore } from '@/models/auth/stores/auth-store'

export const protectedRoutes: RouteObject[] = [
  {
    element: <ProtectedWrapper />,
    children: [
      {
        element: <RootLayout children={<Outlet />} />,
        children: [
          {
            path: ROUTES.app.hra.href,
            element: <HRAPage />,
          },
          {
            path: ROUTES.app.hraActivity.href,
            element: <HraActivityPage />,
          },
          {
            path: ROUTES.app.support.href,
            element: <SupportPage />,
          },
          {
            path: ROUTES.app.settings.href,
            element: <SettingsPage />,
          },
          {
            path: ROUTES.app.test.href,
            element: <TestPage />,
          },
        ],
      },
    ],
  },
]

function ProtectedWrapper() {
  const isAuthDisabled = useAuthStore(state => state.isAuthDisabled)
  return (
    <ProtectedRoute bypassAuth={isAuthDisabled}>
      <Outlet />
    </ProtectedRoute>
  )
}

export default protectedRoutes
