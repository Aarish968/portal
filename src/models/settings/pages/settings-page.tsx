import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import SettingsView from '@/models/settings/views/settings-view'

function SettingsPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.settings.title,
      ROUTES.app.settings.metaDescription,
    )
  }, [updatePageInfo])

  return <SettingsView />
}

export default SettingsPage
