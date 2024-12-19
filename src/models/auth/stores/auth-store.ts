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
}))
