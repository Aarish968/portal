import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings } from '../schemas/settings-schema'
import { SettingsSchema } from '../schemas/settings-schema'

interface SettingsStore {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

const defaultSettings: Settings = {
  notifications: true,
  darkMode: false,
  language: 'English',
  fontSize: 'Medium',
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      settings: defaultSettings,
      updateSettings: newSettings =>
        set((state) => {
          const updatedSettings = { ...state.settings, ...newSettings }
          const parsedSettings = SettingsSchema.safeParse(updatedSettings)
          if (parsedSettings.success) {
            return { settings: parsedSettings.data }
          }
          console.error('Invalid settings:', parsedSettings.error)
          return state
        }),
    }),
    {
      name: 'settings-storage',
    },
  ),
)
