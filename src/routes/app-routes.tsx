import { Route, Routes } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import RootLayout from '@/layouts/root-layout'
import MemberSearchPage from '@/models/member-search/pages/member-search-page'

function AppRoutes() {
  return (
    <>
      <RootLayout>
        <Routes>
          <Route path={ROUTES.app.search.href} element={<MemberSearchPage />} />
        </Routes>
      </RootLayout>
    </>
  )
}

export default AppRoutes
