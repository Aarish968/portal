import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useHraActivityStore } from '../stores/hra-activity-store'
import { HraActivityList } from '@/models/hra-activity/components/hra-activity-list'
import { HraActivityFilter } from '@/models/hra-activity/components/hra-activity-filter'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import type { HraActivity } from '@/models/hra-activity/schemas/hra-activity-schema'
import { useToast } from '@/base_submod/hooks/use-toast'

function HraActivityView() {
  const { toast } = useToast()
  const { hraActivity, isLoading, error, fetchHraActivities } = useHraActivityStore()
  const [filteredHraActivity, setFilteredHraActivity] = useState<HraActivity>({
    assessments: [],
  })

  useEffect(() => {
    fetchHraActivities()
  }, [fetchHraActivities])

  useEffect(() => {
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error,
      })
    }
  }, [error, toast])

  useEffect(() => {
    setFilteredHraActivity({ assessments: hraActivity.assessments })
  }, [hraActivity])

  const handleFilterChange = (filter: 'All' | 'Upcoming' | 'In Progress' | 'Completed') => {
    const filterMap = {
      'All': () => hraActivity.assessments,
      'Upcoming': () => hraActivity.assessments.filter(activity => !activity.IsStarted && !activity.IsCompletedFlag),
      'In Progress': () => hraActivity.assessments.filter(activity => activity.IsStarted && !activity.IsCompletedFlag),
      'Completed': () => hraActivity.assessments.filter(activity => activity.IsCompletedFlag),
    }

    setFilteredHraActivity({ assessments: filterMap[filter]() })
  }

  return (
    <BasePractitionerView
      title="HRA Activity"
      description="View and manage Health Risk Assessment activities"
      actionButton={<HraActivityFilter onFilterChange={handleFilterChange} />}
    >
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && <HraActivityList hraActivity={filteredHraActivity} />}
    </BasePractitionerView>
  )
}

export default HraActivityView
