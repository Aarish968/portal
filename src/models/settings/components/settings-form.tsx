import { useSettingsStore } from '../stores/settings-store'
import { Switch } from '@/base_submod/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/base_submod/components/ui/select'
import { Label } from '@/base_submod/components/ui/label'
import type { Settings } from '@/models/settings/schemas/settings-schema'

export function SettingsForm() {
  const { settings, updateSettings } = useSettingsStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Notifications</Label>
        <Switch
          id="notifications"
          checked={settings.notifications}
          onCheckedChange={checked => updateSettings({ notifications: checked })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="darkMode">Dark Mode</Label>
        <Switch
          id="darkMode"
          checked={settings.darkMode}
          onCheckedChange={checked => updateSettings({ darkMode: checked })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select
          value={settings.language}
          onValueChange={value => updateSettings({ language: value as Settings['language'] })}
        >
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="English">English</SelectItem>
            <SelectItem value="Spanish">Spanish</SelectItem>
            <SelectItem value="French">French</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontSize">Font Size</Label>
        <Select
          value={settings.fontSize}
          onValueChange={value => updateSettings({ fontSize: value as Settings['fontSize'] })}
        >
          <SelectTrigger id="fontSize">
            <SelectValue placeholder="Select font size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Small">Small</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
