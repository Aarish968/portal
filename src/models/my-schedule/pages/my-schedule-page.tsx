import { useEffect } from 'react'
import { useNavigation } from '@/base_submod/contexts/navigation-context'
import ROUTES from '@/data/routing/routes'
import MyScheduleView from '@/models/my-schedule/views/my-schedule-view'

function MySchedulePage() {
  const { updatePageInfo } = useNavigation()

  useEffect(() => {
    updatePageInfo(
      ROUTES.app.my_schedule.title,
      ROUTES.app.my_schedule.metaDescription,
    )
  }, [updatePageInfo])

  return <MyScheduleView />
}

export default MySchedulePage
