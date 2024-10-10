import { z } from 'zod'

export const HraActivityItemSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
  phone: z.string(),
  hraStatus: z.enum(['Not Started', 'In Progress', 'Completed']),
})

export const HraActivitySchema = z.object({
  activities: z.array(HraActivityItemSchema),
  totalCount: z.number(),
})

export type HraActivityItem = z.infer<typeof HraActivityItemSchema>
export type HraActivity = z.infer<typeof HraActivitySchema>
