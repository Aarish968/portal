import { Navigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from '@azure/msal-browser'
import { useAuthStore } from '@/models/auth/stores/auth-store'
import ROUTES from '@/data/routing/routes'

export function RootRedirect() {
  const { instance, inProgress } = useMsal()
  const { isAuthenticated } = useAuthStore()

  if (inProgress !== InteractionStatus.None) {
    return null
  }

  const activeAccount = instance.getAllAccounts()[0]

  if (isAuthenticated || activeAccount) {
    return <Navigate to={ROUTES.app.hraActivity.href} replace />
  }

  return <Navigate to={ROUTES.auth.login.href} replace />
}
