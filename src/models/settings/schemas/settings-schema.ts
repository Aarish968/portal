import { z } from 'zod'

export const SettingsSchema = z.object({
  notifications: z.boolean(),
  darkMode: z.boolean(),
  language: z.enum(['English', 'Spanish', 'French']),
  fontSize: z.enum(['Small', 'Medium', 'Large']),
})

export type Settings = z.infer<typeof SettingsSchema>
