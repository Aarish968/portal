import { Route, Routes } from 'react-router-dom'
import ROUTES from '../data/routing/routes'
import RootLayout from '@/layouts/root-layout'
import SearchPage from '@/models/search/pages/search-page'

function AppRoutes() {
  return (
    <>
      <RootLayout>
        <Routes>
          <Route path={ROUTES.app.search.href} element={<SearchPage />} />
        </Routes>
      </RootLayout>
    </>
  )
}

export default AppRoutes
