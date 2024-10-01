import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import SupportView from '@/models/support/views/support-view'

function SupportPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.support.title,
      ROUTES.app.support.metaDescription,
    )
  }, [updatePageInfo])

  return <SupportView />
}

export default SupportPage
