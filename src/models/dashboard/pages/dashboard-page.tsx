import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import DashboardView from '@/models/dashboard/views/dashboard-view'

function DashboardPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.home.title,
      ROUTES.home.metaDescription,
    )
  }, [updatePageInfo])

  return <DashboardView />
}

export default DashboardPage
