import type { SiteLink } from '@/base_submod/schemas/router'

export interface AppRoutes {
  search: SiteLink
  member_history: SiteLink
  my_schedule: SiteLink
  support: SiteLink
  settings: SiteLink
}

export const APP_ROUTES: AppRoutes = {
  search: {
    title: 'Search',
    href: '/',
    metaDescription: 'Search for a member',
    menuDescription: 'Search for a member',
  },
  member_history: {
    title: 'Member History',
    href: '/member-history',
    metaDescription: 'View member history',
    menuDescription: 'View member history',
  },
  my_schedule: {
    title: 'My Schedule',
    href: '/my-schedule',
    metaDescription: 'View my schedule',
    menuDescription: 'View my schedule',
  },
  support: {
    title: 'Support',
    href: '/support',
    metaDescription: 'View support information',
    menuDescription: 'View support information',
  },
  settings: {
    title: 'Settings',
    href: '/settings',
    metaDescription: 'View settings',
    menuDescription: 'View settings',
  },
}
