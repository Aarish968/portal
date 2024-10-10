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

export type Member = z.infer<typeof MemberSchema>
export type SearchResponse = z.infer<typeof SearchResponseSchema>
export type MemberSearchFormData = z.infer<typeof MemberSearchFormSchema>
