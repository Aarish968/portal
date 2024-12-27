import type { StateCreator } from 'zustand'
import { create } from 'zustand'
import { type PersistOptions, persist } from 'zustand/middleware'
import { type AuthUser, AuthUserSchema } from '@/models/auth/schemas/auth-schema'
import { jwtDecode } from 'jwt-decode'
import { msalInstance } from '@/base_submod/utils/MSAL'
import ROUTES from '@/data/routing/routes'

function redirectToLogin() {
  window.location.href = ROUTES.auth.login.href
}

const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000

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
  refreshTokenIfNeeded: () => Promise<void>
  getTokenExpiration: () => number | null
}

interface PersistedState {
  idToken: string | null
  tokenExpiration: number | null
  currentUser: AuthUser | null
  isAuthenticated: boolean
}

function isTokenExpired(exp: number): boolean {
  const expirationMs = exp * 1000
  const now = Date.now()
  return now >= expirationMs
}

function getTokenRemainingTime(exp: number): number {
  const expirationMs = exp * 1000
  return expirationMs - Date.now()
}

async function refreshToken(set: (state: Partial<AuthStore>) => void) {
  try {
    const currentAccount = msalInstance.getAllAccounts()[0]
    if (!currentAccount) {
      throw new Error('No account found')
    }

    const silentRequest = {
      account: currentAccount,
      scopes: ['openid', 'profile', 'email'],
    }

    const response = await msalInstance.acquireTokenSilent(silentRequest)
    if (!response.idToken) {
      throw new Error('No token in response')
    }

    const decodedToken = jwtDecode<{ exp: number }>(response.idToken)
    if (!decodedToken.exp) {
      throw new Error('Token missing expiration')
    }

    set({
      idToken: response.idToken,
      tokenExpiration: decodedToken.exp * 1000,
      isAuthenticated: true,
    })
    return true
  }
  catch (error) {
    console.error('Token refresh failed:', error)
    redirectToLogin()
    return false
  }
}

type AuthStorePersist = (
  config: StateCreator<AuthStore>,
  options: PersistOptions<AuthStore, PersistedState>
) => StateCreator<AuthStore>

export const useAuthStore = create<AuthStore>()(
  (persist as AuthStorePersist)(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      isLoading: false,
      error: null,
      idToken: null,
      tokenExpiration: null,

      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),

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
            tokenExpiration: decodedToken.exp * 1000,
          })
        }
        catch (error) {
          console.error('Failed to decode token:', error)
          set({ idToken: null, tokenExpiration: null })
        }
      },

      getTokenExpiration: () => {
        if (get().idToken) {
          try {
            const decodedToken = jwtDecode<{ exp: number }>(get().idToken!)
            return decodedToken.exp * 1000
          }
          catch (error) {
            console.error('Failed to decode token for expiration check:', error)
            return null
          }
        }
        return null
      },

      refreshTokenIfNeeded: async () => {
        const expiration = get().getTokenExpiration()

        if (!expiration) {
          await refreshToken(set)
          return
        }

        if (isTokenExpired(expiration / 1000) || getTokenRemainingTime(expiration / 1000) <= TOKEN_REFRESH_BUFFER) {
          await refreshToken(set)
        }
      },

      getAuthHeaders: async () => {
        try {
          const currentToken = get().idToken
          const expiration = get().getTokenExpiration()

          if (!currentToken || !expiration || isTokenExpired(expiration / 1000)) {
            await refreshToken(set)
          }
          else if (getTokenRemainingTime(expiration / 1000) <= TOKEN_REFRESH_BUFFER) {
            await refreshToken(set)
          }

          const idToken = get().idToken
          if (!idToken) {
            redirectToLogin()
            return {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': '',
            }
          }

          return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          }
        }
        catch (error) {
          console.error('Error getting auth headers:', error)
          redirectToLogin()
          return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': '',
          }
        }
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
