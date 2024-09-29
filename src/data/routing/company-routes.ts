import type { SiteLink } from '@/base_submod/schemas/router'

export interface CompanyRoutes {
  aboutUs: SiteLink
  contactUs: SiteLink
  support: SiteLink
  news: SiteLink
  faq: SiteLink
  contact: SiteLink
  privacyPolicy: SiteLink
  copyright: SiteLink
  pageNotFound: SiteLink
  errorPage: SiteLink
  siteMap: SiteLink
  termsOfUse: SiteLink
  medicalDisclaimer: SiteLink
}

export const COMPANY_ROUTES: CompanyRoutes = {
  aboutUs: {
    title: 'About Us',
    href: 'https://www.helloporter.com/about-us/',
    metaDescription: 'View Porter\'s about us page',
    menuDescription: 'About us',
    icon: 'ph:users-three',
    isExternal: true,
  },
  contactUs: {
    title: 'Contact Us',
    href: '/contact-us',
    metaDescription: 'Contact Porter',
    menuDescription: 'Contact us',
    icon: 'ph:phone',
  },
  support: {
    title: 'Support',
    href: '/contact-us',
    metaDescription: 'View Porter\'s support page',
    menuDescription: 'Support',
    icon: 'ph:phone',
  },
  news: {
    title: 'News & Updates',
    href: 'https://www.helloporter.com/news/',
    metaDescription: 'View Porter\'s news & updates',
    menuDescription: 'News & updates',
    icon: 'ph:newspaper',
    isExternal: true,
  },
  faq: {
    title: 'FAQs',
    href: 'https://www.helloporter.com/faqs/',
    metaDescription: 'View frequently asked questions',
    menuDescription: 'FAQs',
    icon: 'ph:question',
    isExternal: true,
  },
  contact: {
    title: 'Contact',
    href: '/contact',
    metaDescription: 'Contact Porter',
    menuDescription: 'Contact us',
    icon: 'ph:envelope',
  },
  privacyPolicy: {
    title: 'Privacy',
    href: 'https://www.helloporter.com/privacy-policy/',
    metaDescription: 'View Porter\'s privacy policy',
    menuDescription: 'Privacy policy',
    icon: 'ph:shield',
  },
  copyright: {
    title: 'Copyright',
    href: '/copyright',
    metaDescription: 'View Porter\'s copyright information',
    menuDescription: 'Copyright',
    icon: 'ph:copyright',
  },
  pageNotFound: {
    title: 'Page Not Found',
    href: '/404',
    metaDescription: 'The requested page could not be found',
    menuDescription: 'Error: Page not found',
    icon: 'ph:warning',
  },
  errorPage: {
    title: 'Error',
    href: '/Error',
    metaDescription: 'An error occurred',
    menuDescription: 'Error',
    icon: 'ph:x-circle',
  },
  siteMap: {
    title: 'Sitemap',
    href: '/sitemap',
    metaDescription: 'View Porter\'s sitemap',
    menuDescription: 'Sitemap',
    icon: 'ph:tree-structure',
  },
  termsOfUse: {
    title: 'Terms of Use',
    href: 'https://www.helloporter.com/terms-of-use/',
    metaDescription: 'View Porter\'s terms of use',
    menuDescription: 'Terms of use',
    icon: 'ph:file-text',
    isExternal: true,
  },
  medicalDisclaimer: {
    title: 'Medical Disclaimer',
    href: 'https://www.helloporter.com/medical-disclaimer/',
    metaDescription: 'View Porter\'s medical disclaimer',
    menuDescription: 'Medical disclaimer',
    icon: 'ph:first-aid-kit',
    isExternal: true,
  },
}
