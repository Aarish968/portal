import { create } from 'zustand'
import { type AuthUser, AuthUserSchema } from '@/models/auth/schemas/auth-schema'

interface AuthStore {
  isAuthenticated: boolean
  isAuthDisabled: boolean
  currentUser: AuthUser | null
  isLoading: boolean
  error: string | null

  setIsAuthenticated: (value: boolean) => void
  setIsAuthDisabled: (value: boolean) => void
  setCurrentUser: (user: AuthUser) => void
  clearCurrentUser: () => void
  updateUserProfile: (updates: Partial<AuthUser>) => void
  fetchCurrentUser: () => Promise<void>
}

const fakeUser: AuthUser = {
  id: '1',
  name: 'johndoe',
  username: 'john.doe@example.com',
  role: 'user',
  createdAt: new Date('2024-10-01'),
  lastLogin: new Date(),
  homeAccountId: 'home123',
  tenantId: 'tenant123',
  localAccountId: 'local123',
  environment: 'production',
  idTokenClaims: {
    aud: 'audience123',
    iss: 'issuer123',
    iat: 1234567890,
    nbf: 1234567890,
    exp: 1234567890,
    oid: 'oid123',
    preferred_username: 'john.doe@example.com',
    sub: 'sub123',
    tid: 'tid123',
  },
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuthenticated: false,
  isAuthDisabled: false,
  currentUser: null,
  isLoading: false,
  error: null,

  setIsAuthenticated: value => set({ isAuthenticated: value }),
  setIsAuthDisabled: value => set({ isAuthDisabled: value }),

  setCurrentUser: (user: AuthUser) => {
    const parsedUser = AuthUserSchema.safeParse(user)
    if (parsedUser.success) {
      set({ currentUser: parsedUser.data, error: null, isAuthenticated: true })
    }
    else {
      console.error('Invalid user data:', parsedUser.error.errors)
      set({ error: 'Error: Invalid user data format' })
    }
  },

  clearCurrentUser: () => {
    set({ currentUser: null, isAuthenticated: false })
  },

  updateUserProfile: (updates: Partial<AuthUser>) => {
    set((state) => {
      if (!state.currentUser)
        return state

      const updatedUser = { ...state.currentUser, ...updates }
      const parsedUser = AuthUserSchema.safeParse(updatedUser)

      if (parsedUser.success) {
        return { currentUser: parsedUser.data, error: null }
      }
      else {
        console.error('Invalid user data:', parsedUser.error.errors)
        return { error: 'Error: Invalid user data format' }
      }
    })
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const parsedUser = AuthUserSchema.safeParse(fakeUser)
      if (parsedUser.success) {
        set({
          currentUser: parsedUser.data,
          isLoading: false,
          error: null,
          isAuthenticated: true,
        })
      }
      else {
        throw new Error('Invalid user data in mock data')
      }
    }
    catch (error) {
      set({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        isLoading: false,
        isAuthenticated: false,
      })
    }
  },
}))
