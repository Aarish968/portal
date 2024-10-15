import { create } from 'zustand'
import type { User } from '../schemas/user-schema'
import { UserSchema } from '../schemas/user-schema'

interface UserStore {
  currentUser: User | null
  isLoading: boolean
  error: string | null
  setCurrentUser: (user: User) => void
  clearCurrentUser: () => void
  updateUserProfile: (updates: Partial<User>) => void
  fetchCurrentUser: () => Promise<void>
}

const fakeUser: User = {
  id: '1',
  username: 'johndoe',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  createdAt: new Date('2024-10-01'),
  lastLogin: new Date(),
}

export const useUserStore = create<UserStore>(set => ({
  currentUser: null,
  isLoading: false,
  error: null,

  setCurrentUser: (user: User) => {
    const parsedUser = UserSchema.safeParse(user)
    if (parsedUser.success) {
      set({ currentUser: parsedUser.data, error: null })
    }
    else {
      console.error('Invalid user data:', parsedUser.error.errors)
      set({ error: 'Error: Invalid user data format' })
    }
  },

  clearCurrentUser: () => {
    set({ currentUser: null })
  },

  updateUserProfile: (updates: Partial<User>) => {
    set((state) => {
      if (!state.currentUser)
        return state

      const updatedUser = { ...state.currentUser, ...updates }
      const parsedUser = UserSchema.safeParse(updatedUser)

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
      const parsedUser = UserSchema.safeParse(fakeUser)
      if (parsedUser.success) {
        set({ currentUser: parsedUser.data, isLoading: false, error: null })
      }
      else {
        throw new Error('Invalid user data in mock data')
      }
    }
    catch (error) {
      set({ error: error instanceof Error ? error.message : 'An unknown error occurred', isLoading: false })
    }
  },
}))
