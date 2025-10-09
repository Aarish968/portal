import type { SiteLink } from '@/base_submod/schemas/router'

export interface AppRoutes {
  hra: SiteLink
  hraActivity: SiteLink
  visits: SiteLink
  visitDetails: SiteLink
  support: SiteLink
  settings: SiteLink
  test: SiteLink
}

export const APP_ROUTES: AppRoutes = {
  hra: {
    title: 'HRA',
    href: '/hra',
    metaDescription: 'View HRA',
    menuDescription: 'View HRA',
    icon: 'ph:activity',
  },
  hraActivity: {
    title: 'HRA Activity',
    href: '/hra-activity',
    metaDescription: 'View HRA Activity',
    menuDescription: 'View HRA Activity',
    icon: 'ph:chart-bar',
  },
  visits: {
    title: 'Visit Outcomes',
    href: '/visits',
    metaDescription: 'View patient visits',
    menuDescription: 'View patient visits',
    icon: 'ph:calendar-check',
  },
  visitDetails: {
    title: 'Visit Details',
    href: '/visits/:visitId',
    metaDescription: 'View visit details',
    menuDescription: 'View visit details',
    icon: 'ph:info',
  },
  support: {
    title: 'Support',
    href: '/support',
    metaDescription: 'View support information',
    menuDescription: 'View support information',
    icon: 'ph:question',
  },
  settings: {
    title: 'Settings',
    href: '/settings',
    metaDescription: 'View settings',
    menuDescription: 'View settings',
    icon: 'ph:gear',
  },
  test: {
    title: 'Testing',
    href: '/test',
    metaDescription: 'Test',
    menuDescription: 'Test',
    icon: 'ph:test-tube',
  },
}
