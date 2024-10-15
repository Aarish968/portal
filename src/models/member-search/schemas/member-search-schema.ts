import { z } from 'zod'
import { MemberSchema } from '@/models/member/schemas/member-schema'

export const SearchResponseSchema = z.object({
  members: z.array(MemberSchema),
  totalCount: z.number(),
})

export const MemberSearchFormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  dateOfBirth: z.string().regex(/^([1-9]|0[1-9]|1[0-2])\/([1-9]|0[1-9]|[12]\d|3[01])\/\d{4}$/, {
    message: 'Date of birth must be in the format MM/DD/YYYY.',
  }),
  healthPlan: z.string(),
})

export type SearchResponse = z.infer<typeof SearchResponseSchema>
export type MemberSearchFormData = z.infer<typeof MemberSearchFormSchema>
