import { useMemberSearchStore } from '../stores/member-search-store'
import MemberSearchForm from '@/models/member-search/components/member-search-form'
import MemberSearchDetailsCard from '@/models/member-search/components/member-search-details-card'

function MemberSearchView() {
  const { searchResults, isLoading } = useMemberSearchStore()

  const handleStartHRS = () => {
  }

  const handleCancel = () => {
  }

  return (
    <div className=":uno: w-full">
      <MemberSearchForm />
      {isLoading && <p>Loading...</p>}
      {!isLoading && searchResults.members.length > 0 && (
        <MemberSearchDetailsCard
          member={searchResults.members[0]}
          onStartHRS={handleStartHRS}
          onCancel={handleCancel}
        />
      )}
    </div>
  )
}

export default MemberSearchView
