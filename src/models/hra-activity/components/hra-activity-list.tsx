import type { HraActivity, HraActivityItem } from '@/models/hra-activity/schemas/hra-activity-schema'
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
  hraActivity: HraActivity
}

export function HraActivityList({ hraActivity }: HraActivityListProps) {
  function getBadgeVariant(isStarted: boolean, isCompleted: boolean) {
    if (isCompleted)
      return 'success'
    if (isStarted)
      return 'warning'
    return 'noStatus'
  }

  function getStatusText(isStarted: boolean, isCompleted: boolean) {
    if (isCompleted)
      return 'Completed'
    if (isStarted)
      return 'In Progress'
    return 'Not Started'
  }

  function formatAddress(address: HraActivityItem['memberAddress']) {
    return `${address.street}, ${address.city}, ${address.state} ${address.zip}`
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hraActivity.assessments.map(activity => (
              <TableRow key={activity.assessmentID}>
                <TableCell>{`${activity.memberFirstName} ${activity.memberLastName}`}</TableCell>
                <TableCell>{formatAddress(activity.memberAddress)}</TableCell>
                <TableCell>{activity.MemberPhone || 'N/A'}</TableCell>
                <TableCell>{activity.MemberPayer}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(activity.IsStarted, activity.IsCompletedFlag)}>
                    {getStatusText(activity.IsStarted, activity.IsCompletedFlag)}
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
