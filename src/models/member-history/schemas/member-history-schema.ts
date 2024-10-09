import { z } from 'zod'

export const MemberHistorySchema = z.object({
  id: z.string(),
  memberId: z.string(),
  memberName: z.string(),
  dateOfScreening: z.string(),
  screeningType: z.string(),
  result: z.string(),
  notes: z.string().optional(),
})

export const MemberHistoryResultSchema = z.object({
  screenings: z.array(MemberHistorySchema),
  totalCount: z.number(),
})

export type MemberHistory = z.infer<typeof MemberHistorySchema>
export type MemberHistoryResult = z.infer<typeof MemberHistoryResultSchema>
