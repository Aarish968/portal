import { SettingsForm } from '../components/settings-form'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'

function SettingsView() {
  return (
    <BasePractitionerView title="Settings" description="Manage your account settings and preferences.">
      <SettingsForm />
    </BasePractitionerView>
  )
}

export default SettingsView
