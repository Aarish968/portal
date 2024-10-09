import { Route, Routes } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import RootLayout from '@/layouts/root-layout'
import MemberSearchPage from '@/models/member-search/pages/member-search-page'
import MemberHistoryPage from '@/models/member-history/pages/member-history-page'
import SupportPage from '@/models/support/pages/support-page'
import MySchedulePage from '@/models/my-schedule/pages/my-schedule-page'
import SettingsPage from '@/models/settings/pages/settings-page'

function AppRoutes() {
  return (
    <>
      <RootLayout>
        <Routes>
          <Route path={ROUTES.app.search.href} element={<MemberSearchPage />} />
          <Route path={ROUTES.app.member_history.href} element={<MemberHistoryPage />} />
          <Route path={ROUTES.app.my_schedule.href} element={<MySchedulePage />} />
          <Route path={ROUTES.app.support.href} element={<SupportPage />} />
          <Route path={ROUTES.app.settings.href} element={<SettingsPage />} />
        </Routes>
      </RootLayout>
    </>
  )
}

export default AppRoutes
