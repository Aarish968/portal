import type { ScheduledPatient } from '../schemas/my-schedule-schema'
import { useMyScheduleStore } from '../stores/my-schedule-store'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/base_submod/components/ui/table'
import { Button } from '@/base_submod/components/ui/button'
import { CapitalizeString } from '@/base_submod/utils/Strings'

interface MyScheduleTableProps {
  className?: string
}

export function MyScheduleTable({ className = '' }: MyScheduleTableProps) {
  const { scheduleData } = useMyScheduleStore()

  const handleStartHRA = (patientId: string) => {
    console.log(`Starting HRA for patient ${patientId}`)
  }

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead>Patient Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>HRA Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduleData.scheduledPatients.map((patient: ScheduledPatient) => (
          <TableRow key={patient.id}>
            <TableCell>{CapitalizeString(patient.patientName)}</TableCell>
            <TableCell>{patient.appointmentDate}</TableCell>
            <TableCell>{patient.appointmentTime}</TableCell>
            <TableCell>{patient.hraStatus}</TableCell>
            <TableCell>
              <Button
                onClick={() => handleStartHRA(patient.id)}
                disabled={patient.hraStatus === 'Completed'}
              >
                {patient.hraStatus === 'Not Started' ? 'Start HRA' : 'Continue HRA'}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
