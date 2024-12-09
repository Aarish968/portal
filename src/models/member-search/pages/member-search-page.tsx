import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import MemberSearchView from '@/models/member-search/views/member-search-view'

function MemberSearchPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      'Search for a member',
      'Search for a member by name, email, or phone number',
    )
  }, [updatePageInfo])

  return (
    <MemberSearchView />
  )
}

export default MemberSearchPage
