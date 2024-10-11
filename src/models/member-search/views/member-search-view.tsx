import { useMemberSearchStore } from '../stores/member-search-store'
import MemberSearchForm from '@/models/member-search/components/member-search-form'
import MemberSearchDetailsCard from '@/models/member-search/components/member-search-details-card'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import MemberSearchLoadingCard from '@/models/member-search/components/member-search-loading-card'

function MemberSearchView() {
  const { searchResults, isLoading } = useMemberSearchStore()

  return (
    <BasePractitionerView title="Member Search" description="Enter the required information below to pull up member details">
      <MemberSearchForm />
      {isLoading && <MemberSearchLoadingCard />}
      {!isLoading && searchResults.members.length > 0 && (
        <>
          <div className=":uno: z-4 my-6 h-1px w-full bg-gray-g-200"></div>
          <div className=":uno: mb-3 font-medium">Results:</div>
          <MemberSearchDetailsCard
            member={searchResults.members[0]}
          />
        </>
      )}
    </BasePractitionerView>
  )
}

export default MemberSearchView
