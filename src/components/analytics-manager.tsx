import { CookieBanner } from '@palmabit/react-cookie-law'
import { useTranslation } from 'react-i18next'
import { useAuthentication } from '@/models/auth/hooks/useAuthentication'

function AnalyticsManager() {
  useAuthentication()

  const { t } = useTranslation()

  const settings = {
    message: <div className=":uno: leading-[17.333px] font-secondary text-style-caption">{t(`frontend.policy.cookies`)}</div>,
    privacyPolicyLinkText: (
      <a href="https://www.helloporter.com/terms-of-use/" target="_blank" rel="noreferrer">
        {t(`frontend.policy.cookieAndTermsOfUseLinkText`)}
      </a>
    ),
    wholeDomain: true,
    onAccept: () => { },
    onAcceptStatistics: () => {
      // window['Statistics-Allowed'] = false

      // if (typeof freshpaint !== 'undefined') {

      // freshpaint.init('d2736a4b-eef9-4d6b-a6c5-24b53949533a')

      // freshpaint.page()

      // if (authentectionChecker.isValidToken()) {
      // freshpaintIdentitySet(getCognitoId())
      // }
      // }
    },
    statisticsOptionText: 'Analytic Cookies',
    showPreferencesOption: false,
    showStatisticsOption: true,
    showMarketingOption: false,
    necessaryDefaultChecked: true,
    statisticsDefaultChecked: true,
    managePreferencesButtonText: <span className=":uno: hs-cookie-link-text hs-line-height">{t(`frontend.policy.manageMyCookies`)}</span>,
    policyLink: 'https://www.helloporter.com/terms-of-use/',
  }
  return <><CookieBanner className=":uno: hs-cookie-banner" {...settings} /></>
}

export default AnalyticsManager
