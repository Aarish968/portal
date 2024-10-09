import { z } from 'zod'

export const ScheduledPatientSchema = z.object({
  id: z.string(),
  patientName: z.string(),
  appointmentDate: z.string(),
  appointmentTime: z.string(),
  hraStatus: z.enum(['Not Started', 'In Progress', 'Completed']),
})

export const MyScheduleResultSchema = z.object({
  scheduledPatients: z.array(ScheduledPatientSchema),
  totalCount: z.number(),
})

export type ScheduledPatient = z.infer<typeof ScheduledPatientSchema>
export type MyScheduleResult = z.infer<typeof MyScheduleResultSchema>
