import { z } from 'zod'

export const HraActivityItemSchema = z.object({
  id: z.string(),
  memberId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  healthPlan: z.string(),
  hraStatus: z.enum(['Not Started', 'In Progress', 'Completed']),
  lastUpdated: z.string(),
  riskScore: z.number().min(0).max(100).optional(),
})

export const HraActivitySchema = z.object({
  activities: z.array(HraActivityItemSchema),
  totalCount: z.number(),
})

export type HraActivityItem = z.infer<typeof HraActivityItemSchema>
export type HraActivity = z.infer<typeof HraActivitySchema>
