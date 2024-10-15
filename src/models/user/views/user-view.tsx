import { useEffect } from 'react'
import { useUserStore } from '../stores/user-store'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'

function UserView() {
  const { currentUser, isLoading, error, fetchCurrentUser } = useUserStore()

  useEffect(() => {
    fetchCurrentUser()
  }, [fetchCurrentUser])

  if (isLoading) {
    return <div>Loading user profile...</div>
  }

  if (error) {
    return (
      <div>
        Error:
        {' '}
        {error}
        <Button onClick={fetchCurrentUser}>Retry</Button>
      </div>
    )
  }

  if (!currentUser) {
    return <div>No user data available</div>
  }

  return (
    <BasePractitionerView title="User Profile" description="View and manage your user profile">
      <div className="mx-auto max-w-2xl w-full">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-xl font-medium">User Information</h3>
            <div className="space-y-2">
              <p>
                <strong>Username:</strong>
                {' '}
                {currentUser.username}
              </p>
              <p>
                <strong>Email:</strong>
                {' '}
                {currentUser.email}
              </p>
              <p>
                <strong>Name:</strong>
                {' '}
                {currentUser.firstName}
                {' '}
                {currentUser.lastName}
              </p>
              <p>
                <strong>Role:</strong>
                {' '}
                {currentUser.role}
              </p>
              <p>
                <strong>Created At:</strong>
                {' '}
                {currentUser.createdAt.toLocaleDateString()}
              </p>
              {currentUser.lastLogin && (
                <p>
                  <strong>Last Login:</strong>
                  {' '}
                  {currentUser.lastLogin.toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </BasePractitionerView>
  )
}

export default UserView
