import { z } from 'zod'

export const SiteLinkSchema = z.object({
  title: z.string(),
  href: z.string(),
  menuDescription: z.string().describe('A short description used for menu subheadings'),
  metaDescription: z.string().describe('A meta description for SEO'),
  icon: z.string().optional(),
  isExternal: z.boolean().optional(),
})

export type SiteLink = z.infer<typeof SiteLinkSchema>
