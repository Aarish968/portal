import { z } from 'zod'

export const MemberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string().optional(),
  healthPlan: z.string().optional(),
  address: z.string(),
  phone: z.string(),
  email: z.string().optional(),
  hrsStatus: z.string().optional(),
  notes: z.string().optional(),
  assessmentName: z.string().optional(),
  assessmentId: z.string().optional(),
  isStarted: z.boolean().optional(),
  isCompleted: z.boolean().optional(),
})

export type Member = z.infer<typeof MemberSchema>
