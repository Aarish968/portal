import type { HraActivityItem } from '../schemas/hra-activity-schema'

interface HraActivityListProps {
  activities: HraActivityItem[]
}

export function HraActivityList({ activities }: HraActivityListProps) {
  return (
    <ul className="space-y-4">
      {activities.map(activity => (
        <li key={activity.id} className="border rounded-md p-4">
          <h2 className="font-semibold">
            {activity.firstName}
            {' '}
            {activity.lastName}
          </h2>
          <p>
            DOB:
            {activity.dateOfBirth}
          </p>
          <p>
            Health Plan:
            {activity.healthPlan}
          </p>
          <p>
            HRA Status:
            {activity.hraStatus}
          </p>
          <p>
            Last Updated:
            {activity.lastUpdated}
          </p>
          {activity.riskScore !== undefined && (
            <p>
              Risk Score:
              {activity.riskScore}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
