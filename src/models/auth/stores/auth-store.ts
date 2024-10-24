import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
  isAuthDisabled: boolean
  setIsAuthDisabled: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>(set => ({
  isAuthenticated: false,
  setIsAuthenticated: value => set({ isAuthenticated: value }),
  isAuthDisabled: false,
  setIsAuthDisabled: value => set({ isAuthDisabled: value }),
}))
