import ROUTES from '@/data/routing/routes'
import type { SiteLink } from '@/base_submod/schemas/router'

export const SidebarLinks: SiteLink[] = [
  ROUTES.app.search,
  ROUTES.app.member_history,
  ROUTES.app.my_schedule,
  ROUTES.app.support,
  ROUTES.app.settings,
]

export const FooterLinksMain = {
  company: {
    title: 'Company',
    links: [
      ROUTES.company.aboutUs,
      ROUTES.company.contactUs,
      ROUTES.company.news,
    ],
  },
  help: {
    title: 'Help',
    links: [
      ROUTES.company.support,
      ROUTES.company.faq,
    ],
  },
}

export const FooterLinksSecondary = {
  legal: {
    title: 'Legal',
    links: [
      ROUTES.company.privacyPolicy,
      ROUTES.company.termsOfUse,
      ROUTES.company.medicalDisclaimer,
    ],
  },
}
