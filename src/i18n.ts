import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import resources from './locales/index'

i18n
  .use(initReactI18next)

  .init({
    resources,
    lng: 'en',
    supportedLngs: ['de', 'en', 'en_gb', 'es', 'es_mx', 'fr', 'ga', 'ga'],
    nonExplicitSupportedLngs: true,
    fallbackLng: 'en',
    debug: import.meta.env.VITE_APP_I18NEXT_DEBUG,
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
