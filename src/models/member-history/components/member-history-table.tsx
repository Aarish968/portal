import type { MemberHistory } from '../schemas/member-history-schema'
import { usePractitionerScreeningHistoryStore } from '../stores/member-history-store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base_submod/components/ui/table'
import { CapitalizeString } from '@/base_submod/utils/Strings'

interface MemberHistoryTableProps {
  className?: string
}

export function MemberHistoryTable({ className = '' }: MemberHistoryTableProps) {
  const { screeningHistory } = usePractitionerScreeningHistoryStore()

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Member Name</TableHead>
          <TableHead>Date of Screening</TableHead>
          <TableHead>Screening Type</TableHead>
          <TableHead>Result</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {screeningHistory.screenings.map((screening: MemberHistory) => (
          <TableRow key={screening.id}>
            <TableCell>{CapitalizeString(screening.memberName)}</TableCell>
            <TableCell>{screening.dateOfScreening}</TableCell>
            <TableCell>{CapitalizeString(screening.screeningType)}</TableCell>
            <TableCell>{CapitalizeString(screening.result)}</TableCell>
            <TableCell>{screening.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
