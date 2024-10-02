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
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date of birth must be in the format YYYY-MM-DD.',
  }),
})

export type Member = z.infer<typeof MemberSchema>
export type SearchResponse = z.infer<typeof SearchResponseSchema>
export type MemberSearchFormData = z.infer<typeof MemberSearchFormSchema>
