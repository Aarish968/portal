import type { SiteLink } from '@/base_submod/schemas/router'
import TwitterLogo from '@/base_submod/assets/images/logos/twitter-logo.svg'
import FacebookLogo from '@/base_submod/assets/images/logos/facebook-logo.svg'
import LinkedInLogo from '@/base_submod/assets/images/logos/linked-in-logo.svg'
import InstagramLogo from '@/base_submod/assets/images/logos/instagram-logo.svg'

export interface SocialMediaRoutes {
  instagram: SiteLink
  facebook: SiteLink
  linkedin: SiteLink
  twitter: SiteLink
}

export const SOCIAL_MEDIA_ROUTES: SocialMediaRoutes = {
  instagram: {
    title: 'Instagram',
    href: 'https://instagram.com/helloporterus',
    metaDescription: 'Follow Porter on Instagram',
    menuDescription: 'Instagram',
    icon: InstagramLogo,
    isExternal: true,
  },
  facebook: {
    title: 'Facebook',
    href: 'https://www.facebook.com/helloporterus',
    metaDescription: 'Like Porter on Facebook',
    menuDescription: 'Facebook',
    icon: FacebookLogo,
    isExternal: true,
  },
  linkedin: {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/company/helloporterus/',
    metaDescription: 'Connect with Porter on LinkedIn',
    menuDescription: 'LinkedIn',
    icon: LinkedInLogo,
    isExternal: true,
  },
  twitter: {
    title: 'Twitter',
    href: 'https://www.twitter.com/helloporterus',
    metaDescription: 'Follow Porter on Twitter',
    menuDescription: 'Twitter',
    icon: TwitterLogo,
    isExternal: true,
  },
}
