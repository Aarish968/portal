import { useEffect } from 'react'
import { usePractitionerScreeningHistoryStore } from '../stores/member-history-store'
import { MemberHistoryTable } from '../components/member-history-table'

function MemberHistoryView() {
  const { fetchScreeningHistory, isLoading, error } = usePractitionerScreeningHistoryStore()

  useEffect(() => {
    fetchScreeningHistory('practitioner-id')
  }, [fetchScreeningHistory])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return (
      <div>
        Error:
        {error}
      </div>
    )
  }

  return (
    <div>
      <MemberHistoryTable />
    </div>
  )
}

export default MemberHistoryView
