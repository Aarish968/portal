import { z } from 'zod'
import { MemberSchema } from '@/models/member/schemas/member-schema'

export const HRAQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['text', 'multipleChoice', 'boolean']),
  options: z.array(z.string()).optional(),
})

export const HRASchema = z.object({
  member: MemberSchema,
  questions: z.array(HRAQuestionSchema),
  currentQuestionIndex: z.number(),
  status: z.enum(['notStarted', 'inProgress', 'completed']),
  answers: z.record(z.string(), z.union([z.string(), z.boolean()])),
})

export type HRAQuestion = z.infer<typeof HRAQuestionSchema>
export type HRA = z.infer<typeof HRASchema>
