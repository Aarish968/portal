import { AUTH_ROUTES, type AuthRoutes } from './auth-routes'
import { COMPANY_ROUTES, type CompanyRoutes } from '@/data/routing/company-routes'
import { SOCIAL_MEDIA_ROUTES, type SocialMediaRoutes } from '@/base_submod/data/routing/social-media-routes'
import type { AppRoutes } from '@/data/routing/app-routes'
import { APP_ROUTES } from '@/data/routing/app-routes'

export const APP_NAME = 'Nurse Practitioner Portal'

interface Routes {
  auth: AuthRoutes
  company: CompanyRoutes
  socialMedia: SocialMediaRoutes
  app: AppRoutes
}

const ROUTES: Routes = {
  auth: AUTH_ROUTES,
  company: COMPANY_ROUTES,
  socialMedia: SOCIAL_MEDIA_ROUTES,
  app: APP_ROUTES,
}

export function CheckRoutesWithoutLogin(href: string): boolean {
  const routesData: string[] = [
    ROUTES.auth.login.href,
  ]

  return routesData.some(r => r === href || href.includes(r))
}

export default ROUTES
