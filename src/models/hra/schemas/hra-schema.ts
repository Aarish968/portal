import { z } from 'zod'

const HRAQuestionSchema: z.ZodType<any> = z.lazy(() => z.object({
  questionText: z.string(),
  questionId: z.string(),
  children: z.array(HRAQuestionSchema).nullable(),
  answerType: z.string().nullable(),
  answerDetails: z.string().nullable(),
  answerPicklistChoices: z.array(z.string()),
  answer: z.string().nullable(),
  activationDate: z.string().nullable(),
  activityDomain: z.string().nullable(),
  expirationDate: z.string().nullable(),
  loincCode: z.string().nullable(),
  questionClassification: z.string().nullable(),
  status: z.boolean(),
  isPositive: z.boolean(),
  yesIsPositive: z.boolean(),
  payer: z.string().nullable(),
  isAnswerValuePopulated: z.boolean(),
  externalquestionId: z.string().nullable(),
  ehrKey: z.string().nullable(),
}))

export const HRAScreeningSchema = z.object({
  templateId: z.string().nullable(),
  screeningId: z.string(),
  relatedCases: z.array(z.object({
    caseNumber: z.string(),
  })),
  questions: z.array(HRAQuestionSchema),
  name: z.string(),
  isStarted: z.boolean(),
  isCompleted: z.boolean(),
  completionDate: z.string().nullable(),
  agentName: z.string(),
})

const HRAResponseItemSchema = z.object({
  uuid: z.string().nullable(),
  screenings: z.array(HRAScreeningSchema),
  message: z.string().nullable(),
  memberName: z.string(),
  memberLifetimeID: z.string().nullable(),
  memberId: z.string().nullable(),
  memberDOB: z.string().nullable(),
  mbi: z.string().nullable(),
  hContract: z.string().nullable(),
})

export const HRAResponseSchema = z.array(HRAResponseItemSchema)

export const HRASchema = z.object({
  screening: z.object({
    templateId: z.string().nullable(),
    screeningId: z.string(),
    relatedCases: z.array(z.object({
      caseNumber: z.string(),
    })),
    questions: z.array(HRAQuestionSchema),
    name: z.string(),
    isStarted: z.boolean(),
    isCompleted: z.boolean(),
    completionDate: z.string().nullable(),
    agentName: z.string(),
    memberId: z.string().nullable(),
    memberLifetimeID: z.string().nullable(),
    mbi: z.string().nullable(),
    hContract: z.string().nullable(),
  }),
  currentQuestionIndex: z.number(),
  status: z.enum(['notStarted', 'inProgress', 'completed']),
  answers: z.record(z.string(), z.union([z.string(), z.boolean(), z.array(z.string())])),
})

export type HRAQuestion = z.infer<typeof HRAQuestionSchema>
export type HRAScreening = z.infer<typeof HRAScreeningSchema>
export type HRAResponse = z.infer<typeof HRAResponseSchema>
export type HRA = z.infer<typeof HRASchema>
