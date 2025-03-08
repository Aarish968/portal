import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useHraActivityStore } from '../stores/hra-activity-store'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import type { HraActivity } from '@/models/hra-activity/schemas/hra-activity-schema'
import { HraActivityList } from '@/models/hra-activity/components/hra-activity-list'
import { HraActivityFilter } from '@/models/hra-activity/components/hra-activity-filter'
import { Card, CardContent } from '@/base_submod/components/ui/card'

function HraActivityView() {
  const { hraActivity, isLoading, fetchHraActivities } = useHraActivityStore()
  const [filteredHraActivity, setFilteredHraActivity] = useState<HraActivity>({
    assessments: [],
  })

  useEffect(() => {
    fetchHraActivities()
  }, [fetchHraActivities])

  useEffect(() => {
    const upcomingAssessments = hraActivity.assessments.filter(activity => !activity.IsStarted && !activity.IsCompletedFlag)
    setFilteredHraActivity({ assessments: upcomingAssessments })
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
      actionButton={!isLoading && hraActivity.assessments.length > 0 ? <HraActivityFilter onFilterChange={handleFilterChange} /> : undefined}
    >
      {isLoading && (
        <div className=":uno: flex items-center justify-center p-8">
          <Loader2 className=":uno: h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && filteredHraActivity.assessments.length > 0 && (
        <HraActivityList hraActivity={filteredHraActivity} />
      )}

      {!isLoading && filteredHraActivity.assessments.length === 0 && (
        <div className=":uno: h-[calc(100vh-200px)] flex items-center justify-center">
          <Card className=":uno: w-[400px]">
            <CardContent className=":uno: p-6">
              <div className=":uno: flex flex-col items-center justify-center gap-4">
                <div className=":uno: w-full text-center">
                  <h3 className=":uno: mb-2 text-xl font-medium">No HRAs Available</h3>
                  <div className=":uno: text-muted-foreground">You have no HRA's Currently Assigned to You</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </BasePractitionerView>
  )
}

export default HraActivityView
