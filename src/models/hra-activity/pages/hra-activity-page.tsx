import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import HraActivityView from '@/models/hra-activity/views/hra-activity-view'

function HraActivityPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.hraActivity.title,
      ROUTES.app.hraActivity.metaDescription,
    )
  }, [updatePageInfo])

  return <HraActivityView />
}

export default HraActivityPage
