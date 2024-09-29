import { useEffect } from 'react'
import { useNavigation } from '@/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import LoginView from '@/models/auth/views/login-view'

function LoginPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.auth.login.title,
      ROUTES.auth.login.metaDescription,
    )
  }, [updatePageInfo])

  return <LoginView />
}

export default LoginPage
