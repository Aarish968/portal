import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import UserView from '@/models/user/views/user-view'

function UserPage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      'User Profile',
      'View and manage your user profile',
    )
  }, [updatePageInfo])

  return <UserView />
}

export default UserPage
