import { useState } from 'react'
import { useHraActivityStore } from '../stores/hra-activity-store'
import { HraActivityList } from '@/models/hra-activity/components/hra-activity-list'
import { HraActivityFilter } from '@/models/hra-activity/components/hra-activity-filter'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import type { HraActivityItem } from '@/models/hra-activity/schemas/hra-activity-schema'

function HraActivityView() {
  const { hraActivity } = useHraActivityStore()
  const [filteredActivities, setFilteredActivities] = useState<HraActivityItem[]>(hraActivity.activities)

  const handleFilterChange = (filter: 'All' | 'Upcoming' | 'In Progress' | 'Completed') => {
    const filterMap = {
      'All': () => hraActivity.activities,
      'Upcoming': () => hraActivity.activities.filter(activity => activity.hraStatus === 'Not Started'),
      'In Progress': () => hraActivity.activities.filter(activity => activity.hraStatus === 'In Progress'),
      'Completed': () => hraActivity.activities.filter(activity => activity.hraStatus === 'Completed'),
    }

    setFilteredActivities(filterMap[filter]())
  }

  return (
    <BasePractitionerView
      title="HRA Activity"
      description="View and manage Health Risk Assessment activities"
      actionButton={<HraActivityFilter onFilterChange={handleFilterChange} />}
    >

      <HraActivityList activities={filteredActivities} />
    </BasePractitionerView>
  )
}

export default HraActivityView
