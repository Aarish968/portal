import { z } from 'zod'

export const HRAQuestionSchema: z.ZodType<any> = z.lazy(() => z.object({
  questionText: z.string(),
  questionId: z.string(),
  children: z.array(HRAQuestionSchema).nullable(),
  answerType: z.string().nullable(),
  answerDetails: z.any().nullable(),
  answerPicklistChoices: z.array(z.string()).optional(),
  activationDate: z.string().optional(),
  activityDomain: z.string().optional(),
  expirationDate: z.string().optional(),
  loincCode: z.string().optional(),
  questionClassification: z.string().optional(),
  status: z.boolean().optional(),
  isPositive: z.boolean().optional(),
  yesIsPositive: z.boolean().optional(),
  payer: z.string().optional(),
}))

export const HRAScreeningSchema = z.object({
  templateId: z.string(),
  screeningId: z.string(),
  relatedCases: z.array(z.object({
    caseNumber: z.string(),
  })),
  questions: z.array(HRAQuestionSchema),
  memberName: z.string(),
  memberLifetimeID: z.string(),
  memberId: z.string(),
  memberDOB: z.string().nullable(),
  mbi: z.string(),
  hContract: z.string(),
  uuid: z.string(),
})

export const HRAScreeningResponseSchema = z.object({
  screenings: z.array(HRAScreeningSchema),
})

// Define the possible answer types
export const HRAAnswerSchema = z.union([
  z.string(),
  z.boolean(),
  z.array(z.string()),
])

export const HRASchema = z.object({
  screening: HRAScreeningSchema,
  currentQuestionIndex: z.number(),
  status: z.enum(['notStarted', 'inProgress', 'completed']),
  answers: z.record(z.string(), HRAAnswerSchema),
})

export type HRAQuestion = z.infer<typeof HRAQuestionSchema>
export type HRAScreeningResponse = z.infer<typeof HRAScreeningResponseSchema>
export type HRA = z.infer<typeof HRASchema>
export type HRAScreening = z.infer<typeof HRAScreeningSchema>
export type HRAAnswer = z.infer<typeof HRAAnswerSchema>
