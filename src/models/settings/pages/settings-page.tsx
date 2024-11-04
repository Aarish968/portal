import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import SettingsView from '@/models/settings/views/settings-view'

function SettingsPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      'Profile Settings',
      'Manage your profile settings here',
    )
  }, [updatePageInfo])

  return <SettingsView />
}

export default SettingsPage
