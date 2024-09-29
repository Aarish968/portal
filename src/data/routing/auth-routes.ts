import type { SiteLink } from '@/base_submod/schemas/router'

export interface AuthRoutes {
  login: SiteLink
  logout: SiteLink
}

export const AUTH_ROUTES: AuthRoutes = {
  login: {
    title: 'Login',
    href: '/login',
    metaDescription: 'Log in to your Porter account',
    menuDescription: 'Access your account',
    icon: 'ph:sign-in',
  },
  logout: {
    title: 'Log Out',
    href: '/logout',
    metaDescription: 'Log out of your Porter account',
    menuDescription: 'Log out',
    icon: 'ph:sign-out',
  },
}
