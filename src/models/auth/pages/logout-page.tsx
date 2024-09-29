import { useEffect } from 'react'
import { useNavigation } from '@/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import LogoutView from '@/models/auth/views/logout-view'

function LogoutPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.auth.logout.title,
      ROUTES.auth.logout.metaDescription,
    )
  }, [updatePageInfo])

  return <LogoutView />
}

export default LogoutPage
