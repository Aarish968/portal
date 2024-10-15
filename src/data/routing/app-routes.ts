import type { SiteLink } from '@/base_submod/schemas/router'

export interface AppRoutes {
  search: SiteLink
  hra: SiteLink
  hraActivity: SiteLink
  support: SiteLink
  settings: SiteLink
  user: SiteLink
}

export const APP_ROUTES: AppRoutes = {
  search: {
    title: 'Search',
    href: '/',
    metaDescription: 'Search for a member',
    menuDescription: 'Search for a member',
  },
  hra: {
    title: 'HRA',
    href: '/hra',
    metaDescription: 'View HRA',
    menuDescription: 'View HRA',
  },
  hraActivity: {
    title: 'HRA Activity',
    href: '/hra-activity',
    metaDescription: 'View HRA Activity',
    menuDescription: 'View HRA Activity',
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
  user: {
    title: 'User Profile',
    href: '/profile',
    metaDescription: 'View user profile',
    menuDescription: 'View user profile',
  },
}
