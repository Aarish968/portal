import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type AuthUser, AuthUserSchema } from '@/models/auth/schemas/auth-schema'
import { jwtDecode } from 'jwt-decode'
import { msalInstance } from '@/base_submod/utils/MSAL'
import ROUTES from '@/data/routing/routes'

const redirectToLogin = () => {
  window.location.href = ROUTES.auth.login.href
}

interface AuthStore {
  isAuthenticated: boolean
  currentUser: AuthUser | null
  isLoading: boolean
  error: string | null
  idToken: string | null
  tokenExpiration: number | null

  setIsAuthenticated: (value: boolean) => void
  setCurrentUser: (user: AuthUser) => void
  clearCurrentUser: () => void
  updateUserProfile: (updates: Partial<AuthUser>) => void
  setIdToken: (token: string) => void
  getAuthHeaders: () => Promise<Record<string, string>>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      error: null,
      idToken: null,
      tokenExpiration: null,

      setIsAuthenticated: value => set({ isAuthenticated: value }),

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
        set({
          currentUser: null,
          isAuthenticated: false,
          idToken: null,
          tokenExpiration: null,
        })
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

      setIdToken: (token: string) => {
        try {
          const decodedToken = jwtDecode<{ exp: number }>(token)
          set({ 
            idToken: token, 
            tokenExpiration: decodedToken.exp * 1000
          })
        } catch (error) {
          console.error('Failed to decode token:', error)
          set({ idToken: null, tokenExpiration: null })
        }
      },

      getAuthHeaders: async () => {
        const state = useAuthStore.getState()
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }

        if (state.idToken && state.tokenExpiration) {
          const now = Date.now()
          if (now < state.tokenExpiration) {
            headers.Authorization = `Bearer ${state.idToken}`
            return headers
          }
          
          try {
            const currentAccount = msalInstance.getAllAccounts()[0]
            if (currentAccount) {
              const silentRequest = {
                account: currentAccount,
                scopes: ['openid', 'profile', 'email'],
              }
              
              const response = await msalInstance.acquireTokenSilent(silentRequest)
              if (response.idToken) {
                set({ 
                  idToken: response.idToken,
                  tokenExpiration: jwtDecode<{ exp: number }>(response.idToken).exp * 1000,
                  isAuthenticated: true
                })
                headers.Authorization = `Bearer ${response.idToken}`
                return headers
              }
            } else {
              set({ 
                idToken: null, 
                tokenExpiration: null,
                isAuthenticated: false,
                currentUser: null
              })
              redirectToLogin()
            }
          } catch (error) {
            console.error('Failed to refresh token:', error)
            set({ 
              idToken: null, 
              tokenExpiration: null,
              isAuthenticated: false,
              currentUser: null
            })
            redirectToLogin()
          }
        } else {
          redirectToLogin()
        }

        return headers
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        idToken: state.idToken,
        tokenExpiration: state.tokenExpiration,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
