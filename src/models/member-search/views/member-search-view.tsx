import { useMemberSearchStore } from '../stores/member-search-store'
import MemberSearchForm from '@/models/member-search/components/member-search-form'
import MemberSearchDetailsCard from '@/models/member-search/components/member-search-details-card'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import { Button } from '@/base_submod/components/ui/button'
import { Card, CardContent } from '@/base_submod/components/ui/card'

function MemberSearchView() {
  const { searchResults, isLoading } = useMemberSearchStore()

  const handleStartHRS = () => {
  }

  const handleCancel = () => {
  }

  return (
    <BasePractitionerView title="Member Search" description="Enter the required information below to pull up member details">
      <MemberSearchForm />
      {isLoading
      && (
        <Card className=":uno: mt-6 flex items-center justify-center rounded-5 bg-white">
          <CardContent className=":uno: pt-6">
            <div className=":uno: flex flex-col gap-4">
              <p className=":uno: font-sans">Please wait while we find your member...</p>
              <div className=":uno: flex justify-center">
                <Button variant="secondary">Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {!isLoading && searchResults.members.length > 0 && (
        <>
          <div className=":uno: bg-gray-g-200 z-4 my-6 h-1px w-full"></div>
          <div className=":uno: mb-3 font-medium">Results:</div>
          <MemberSearchDetailsCard
            member={searchResults.members[0]}
            onStartHRS={handleStartHRS}
            onCancel={handleCancel}
          />
        </>
      )}
    </BasePractitionerView>
  )
}

export default MemberSearchView
