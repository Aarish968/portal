import { AUTH_ROUTES, type AuthRoutes } from './auth-routes'
import { COMPANY_ROUTES, type CompanyRoutes } from '@/data/routing/company-routes'
import { SOCIAL_MEDIA_ROUTES, type SocialMediaRoutes } from '@/base_submod/data/routing/social-media-routes'
import type { SiteLink } from '@/base_submod/schemas/router'

export const APP_NAME = 'Porter Patient Portal'

interface Routes {
  auth: AuthRoutes
  company: CompanyRoutes
  socialMedia: SocialMediaRoutes
  home: SiteLink
}

const ROUTES: Routes = {
  auth: AUTH_ROUTES,
  company: COMPANY_ROUTES,
  socialMedia: SOCIAL_MEDIA_ROUTES,
  home: {
    title: 'Home',
    href: '/',
    metaDescription: 'Porter home page',
    menuDescription: 'Home',
    icon: 'ph:house',
  },
}

export function CheckRoutesWithoutLogin(href: string): boolean {
  const routesData: string[] = [
    ROUTES.auth.login.href,
  ]

  return routesData.some(r => r === href || href.includes(r))
}

export default ROUTES
