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
    icon: 'ph:magnifying-glass',
  },
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
  user: {
    title: 'User Profile',
    href: '/profile',
    metaDescription: 'View user profile',
    menuDescription: 'View user profile',
    icon: 'ph:user',
  },
}
