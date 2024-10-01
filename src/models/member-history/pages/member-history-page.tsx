import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import MemberHistoryView from '@/models/member-history/views/member-history-view'

function MemberHistoryPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.member_history.title,
      ROUTES.app.member_history.metaDescription,
    )
  }, [updatePageInfo])

  return <MemberHistoryView />
}

export default MemberHistoryPage
