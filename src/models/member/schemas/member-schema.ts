import { z } from 'zod'

export const MemberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  healthPlan: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  hrsStatus: z.string(),
  notes: z.string().optional(),
})

export type Member = z.infer<typeof MemberSchema>
