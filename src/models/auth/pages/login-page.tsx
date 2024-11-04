import { useEffect } from 'react'
import ROUTES from '@/data/routing/routes'
import LoginView from '@/models/auth/views/login-view'
import { useNavigation } from '@/base_submod/contexts/navigation-context'

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
