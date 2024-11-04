import { useEffect } from 'react'
import ROUTES from '@/data/routing/routes'
import LogoutView from '@/models/auth/views/logout-view'
import { useNavigation } from '@/base_submod/contexts/navigation-context'

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
