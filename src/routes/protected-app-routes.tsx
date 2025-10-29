import type { RouteObject } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import RootLayout from '@/layouts/root-layout'
import HRAPage from '@/models/hra/pages/hra-page'
import SupportPage from '@/models/support/pages/support-page'
import SettingsPage from '@/models/settings/pages/settings-page'
import HraActivityPage from '@/models/hra-activity/pages/hra-activity-page'
import VisitsPage from '@/models/visits/pages/visits-page'
import VisitDetailsPage from '@/models/visits/pages/visit-details-page'
import VisitOutcomesPage from '@/models/visits/pages/visit-outcomes-page'
import TestPage from '@/models/test/pages/test-page'
import ProtectedRoute from '@/base_submod/components/auth/protected-route'

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
            path: ROUTES.app.visits.href,
            element: <VisitsPage />,
          },
          {
            path: ROUTES.app.visitDetails.href,
            element: <VisitDetailsPage />,
          },
          {
            path: ROUTES.app.visitOutcomes.href,
            element: <VisitOutcomesPage />,
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
  // Skip authentication in development mode
  const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_SKIP_AUTH === 'true'
  
  if (isDevelopment) {
    return <Outlet />
  }

  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}

export default protectedRoutes
