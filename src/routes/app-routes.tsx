import { Route, Routes } from 'react-router-dom'
import LoginView from '@/models/auth/views/login-view'
import ProtectedAppRoutes from '@/routes/protected-app-routes'
import ProtectedRoute from '@/base_submod/components/auth/protected-route'
import ROUTES from '@/data/routing/routes'
import TestPage from '@/models/test/pages/test-page'
import { useAuthStore } from '@/models/auth/stores/auth-store'

function AppRoutes() {
  const isAuthDisabled = useAuthStore(state => state.isAuthDisabled)
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path={ROUTES.app.test.href} element={<TestPage />} />
      <Route
        path="/*"
        element={(
          <ProtectedRoute bypassAuth={isAuthDisabled}>
            <ProtectedAppRoutes />
          </ProtectedRoute>
        )}
      />
    </Routes>
  )
}

export default AppRoutes
