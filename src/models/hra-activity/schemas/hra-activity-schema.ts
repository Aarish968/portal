import { z } from 'zod'

const AddressSchema = z.object({
  zip: z.string(),
  street: z.string(),
  state: z.string(),
  city: z.string(),
})

export const HraActivityItemSchema = z.object({
  assessmentID: z.string(),
  assessmentName: z.string(),
  memberFirstName: z.string(),
  memberLastName: z.string(),
  memberAddress: AddressSchema,
  MemberPhone: z.string().nullable(),
  MemberPayer: z.string(),
  IsStarted: z.boolean(),
  IsCompletedFlag: z.boolean(),
  CompletedDate: z.string().nullable(),
  message: z.string(),
  visitDate: z.string().nullable(),
  visitTime: z.string().nullable(),
})

export const HraActivitySchema = z.object({
  assessments: z.array(HraActivityItemSchema),
})

export type HraActivityItem = z.infer<typeof HraActivityItemSchema>
export type HraActivity = z.infer<typeof HraActivitySchema>
