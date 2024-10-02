import { useEffect } from 'react'
import ROUTES from '@/data/routing/routes'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import MemberSearchView from '@/models/member-search/views/member-search-view'

function MemberSearchPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.search.title,
      ROUTES.app.search.metaDescription,
    )
  }, [updatePageInfo])

  return <MemberSearchView />
}

export default MemberSearchPage
