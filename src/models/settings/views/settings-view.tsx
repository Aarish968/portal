import { SettingsForm } from '../components/settings-form'
import { useAuthStore } from '@/models/auth/stores/auth-store'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'

function SettingsView() {
  const { currentUser } = useAuthStore()
  return (
    <BasePractitionerView title="Profile Settings" description="Manage your profile settings here">
      <SettingsForm user={currentUser} />
    </BasePractitionerView>
  )
}

export default SettingsView
