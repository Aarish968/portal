import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import SearchView from '@/models/search/views/search-view'

function SearchPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.search.title,
      ROUTES.app.search.metaDescription,
    )
  }, [updatePageInfo])

  return <SearchView />
}

export default SearchPage
