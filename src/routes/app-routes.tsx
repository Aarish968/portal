import { Route, Routes } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import DashboardPage from '@/models/dashboard/pages/dashboard-page'
import RootLayout from '@/layouts/root-layout'

function AppRoutes() {
  return (
    <>
      <RootLayout>
        <Routes>
          <Route path={ROUTES.home.href} element={<DashboardPage />} />
        </Routes>
      </RootLayout>
    </>
  )
}

export default AppRoutes
