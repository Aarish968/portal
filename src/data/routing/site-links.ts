import ROUTES from '@/data/routing/routes'
import type { SiteLink } from '@/base_submod/schemas/router'

export const SidebarLinks: SiteLink[] = [
  ROUTES.home,
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
