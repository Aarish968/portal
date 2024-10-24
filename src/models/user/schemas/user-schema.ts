import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().email(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.date(),
  lastLogin: z.date().optional(),
  homeAccountId: z.string(),
  tenantId: z.string(),
  localAccountId: z.string(),
  environment: z.string(),
  idTokenClaims: z.object({
    aud: z.string(),
    iss: z.string(),
    iat: z.number(),
    nbf: z.number(),
    exp: z.number(),
    oid: z.string(),
    preferred_username: z.string(),
    sub: z.string(),
    tid: z.string(),
  }).optional(),
})

export type User = z.infer<typeof UserSchema>
