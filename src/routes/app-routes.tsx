import { Route, Routes } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import RootLayout from '@/layouts/root-layout'
import MemberSearchPage from '@/models/member-search/pages/member-search-page'
import SupportPage from '@/models/support/pages/support-page'
import SettingsPage from '@/models/settings/pages/settings-page'
import HraActivityPage from '@/models/hra-activity/pages/hra-activity-page'

function AppRoutes() {
  return (
    <>
      <RootLayout>
        <Routes>
          <Route path={ROUTES.app.search.href} element={<MemberSearchPage />} />
          <Route path={ROUTES.app.hraActivity.href} element={<HraActivityPage />} />
          <Route path={ROUTES.app.support.href} element={<SupportPage />} />
          <Route path={ROUTES.app.settings.href} element={<SettingsPage />} />
        </Routes>
      </RootLayout>
    </>
  )
}

export default AppRoutes
