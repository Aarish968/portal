import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { HraActivity, HraActivityItem } from '@/models/hra-activity/schemas/hra-activity-schema'
import { useMemberStore } from '@/models/member/stores/member-store'
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

type SortField = 'name' | 'assessment' | 'visit' | 'address' | 'phone' | 'payer' | 'status'
type SortDirection = 'asc' | 'desc'

export function HraActivityList({ hraActivity }: HraActivityListProps) {
  const navigate = useNavigate()
  const setSelectedMember = useMemberStore(state => state.setSelectedMember)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

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

  function formatVisit(appointmentDatetime: string | null, providerTimezone: string | null) {
    if (!appointmentDatetime)
      return 'Not Scheduled'

    const visitDate = new Date(appointmentDatetime)

    return visitDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: providerTimezone || undefined,
    })
  }

  function formatPhoneNumber(phone: string | null): string {
    if (!phone)
      return 'N/A'

    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length !== 10)
      return phone

    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }
    else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  function getSortedActivities() {
    return [...hraActivity.assessments].sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1

      switch (sortField) {
        case 'name': {
          const nameA = `${a.memberFirstName} ${a.memberLastName}`
          const nameB = `${b.memberFirstName} ${b.memberLastName}`
          return nameA.localeCompare(nameB) * direction
        }
        case 'assessment':
          return a.assessmentName.localeCompare(b.assessmentName) * direction
        case 'visit': {
          const dateA = a.appointmentDatetime ? new Date(a.appointmentDatetime) : new Date(0)
          const dateB = b.appointmentDatetime ? new Date(b.appointmentDatetime) : new Date(0)
          return (dateA.getTime() - dateB.getTime()) * direction
        }
        case 'address':
          return formatAddress(a.memberAddress).localeCompare(formatAddress(b.memberAddress)) * direction
        case 'phone': {
          const phoneA = a.MemberPhone || ''
          const phoneB = b.MemberPhone || ''
          return phoneA.localeCompare(phoneB) * direction
        }
        case 'payer':
          return a.MemberPayer.localeCompare(b.MemberPayer) * direction
        case 'status': {
          const statusA = getStatusText(a.IsStarted, a.IsCompletedFlag)
          const statusB = getStatusText(b.IsStarted, b.IsCompletedFlag)
          return statusA.localeCompare(statusB) * direction
        }
        default:
          return 0
      }
    })
  }

  function handleRowClick(activity: HraActivityItem) {
    setSelectedMember({
      id: activity.assessmentID,
      firstName: activity.memberFirstName,
      lastName: activity.memberLastName,
      address: formatAddress(activity.memberAddress),
      phone: activity.MemberPhone || '',
      assessmentName: activity.assessmentName,
      assessmentId: activity.assessmentID,
      isStarted: activity.IsStarted,
      isCompleted: activity.IsCompletedFlag,
    })
    navigate('/hra')
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return null

    return sortDirection === 'asc' ? <ChevronUp className=":uno: ml-1 inline-block h-4 w-4" /> : <ChevronDown className=":uno: ml-1 inline-block h-4 w-4" />
  }

  return (
    <Card>
      <CardContent className=":uno: pt-6">
        <Table>
          <TableHeader>
            <TableRow className=":uno: font-semibold">
              <TableHead onClick={() => handleSort('name')} className=":uno: cursor-pointer">
                Name
                {' '}
                <SortIcon field="name" />
              </TableHead>
              <TableHead onClick={() => handleSort('assessment')} className=":uno: cursor-pointer">
                Assessment
                {' '}
                <SortIcon field="assessment" />
              </TableHead>
              <TableHead onClick={() => handleSort('visit')} className=":uno: cursor-pointer">
                Visit
                {' '}
                <SortIcon field="visit" />
              </TableHead>
              <TableHead onClick={() => handleSort('address')} className=":uno: cursor-pointer">
                Address
                {' '}
                <SortIcon field="address" />
              </TableHead>
              <TableHead onClick={() => handleSort('phone')} className=":uno: cursor-pointer">
                Phone
                {' '}
                <SortIcon field="phone" />
              </TableHead>
              <TableHead onClick={() => handleSort('payer')} className=":uno: cursor-pointer">
                Payer
                {' '}
                <SortIcon field="payer" />
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className=":uno: cursor-pointer">
                Status
                {' '}
                <SortIcon field="status" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getSortedActivities().map(activity => (
              <TableRow
                key={activity.assessmentID}
                onClick={() => handleRowClick(activity)}
                className=":uno: cursor-pointer hover:bg-muted/50"
              >
                <TableCell>{`${activity.memberFirstName} ${activity.memberLastName}`}</TableCell>
                <TableCell>{activity.assessmentName}</TableCell>
                <TableCell>{formatVisit(activity.appointmentDatetime, activity.providerTimezone)}</TableCell>
                <TableCell>{formatAddress(activity.memberAddress)}</TableCell>
                <TableCell>{formatPhoneNumber(activity.MemberPhone)}</TableCell>
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
