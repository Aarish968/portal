import type { HraActivityItem } from '@/models/hra-activity/schemas/hra-activity-schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base_submod/components/ui/table'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Badge } from '@/base_submod/components/ui/badge'

interface HraActivityListProps {
  activities: HraActivityItem[]
}

export function HraActivityList({ activities }: HraActivityListProps) {
  function getBadgeVariant(status: string) {
    switch (status) {
      case 'In Progress':
        return 'warning'
      case 'Completed':
        return 'success'
      default:
        return 'noStatus'
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>HRA Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map(activity => (
              <TableRow key={activity.id}>
                <TableCell>{`${activity.firstName} ${activity.lastName}`}</TableCell>
                <TableCell>{activity.dateOfBirth}</TableCell>
                <TableCell>{activity.address}</TableCell>
                <TableCell>{activity.phone}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(activity.hraStatus)}>
                    {activity.hraStatus}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
