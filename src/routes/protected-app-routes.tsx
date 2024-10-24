import { Route, Routes } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import RootLayout from '@/layouts/root-layout'
import HRAPage from '@/models/hra/pages/hra-page'
import UserPage from '@/models/user/pages/user-page'
import SupportPage from '@/models/support/pages/support-page'
import SettingsPage from '@/models/settings/pages/settings-page'
import HraActivityPage from '@/models/hra-activity/pages/hra-activity-page'
import MemberSearchPage from '@/models/member-search/pages/member-search-page'

function ProtectedAppRoutes() {
  return (
    <RootLayout>
      <Routes>
        <Route path={ROUTES.app.search.href} element={<MemberSearchPage />} />
        <Route path={ROUTES.app.hra.href} element={<HRAPage />} />
        <Route path={ROUTES.app.hraActivity.href} element={<HraActivityPage />} />
        <Route path={ROUTES.app.support.href} element={<SupportPage />} />
        <Route path={ROUTES.app.settings.href} element={<SettingsPage />} />
        <Route path={ROUTES.app.user.href} element={<UserPage />} />
      </Routes>
    </RootLayout>
  )
}

export default ProtectedAppRoutes
