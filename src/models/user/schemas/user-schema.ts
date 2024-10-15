import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.date(),
  lastLogin: z.date().optional(),
})

export type User = z.infer<typeof UserSchema>
