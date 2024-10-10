import { useHraActivityStore } from '../stores/hra-activity-store'
import { HraActivityList } from '../components/hra-activity-list'

function HraActivityView() {
  const { hraActivity } = useHraActivityStore()

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">HRA Activity</h1>
      <p className="mb-4">
        Total activities:
        {hraActivity.totalCount}
      </p>
      <HraActivityList activities={hraActivity.activities} />
    </div>
  )
}

export default HraActivityView
