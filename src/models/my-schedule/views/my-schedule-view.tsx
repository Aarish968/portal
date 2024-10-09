import { useEffect } from 'react'
import { useMyScheduleStore } from '../stores/my-schedule-store'
import { MyScheduleTable } from '../components/my-schedule-table'

function MyScheduleView() {
  const { fetchSchedule, isLoading, error } = useMyScheduleStore()

  useEffect(() => {
    fetchSchedule('practitioner-id')
  }, [fetchSchedule])

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
      <MyScheduleTable />
    </div>
  )
}

export default MyScheduleView
