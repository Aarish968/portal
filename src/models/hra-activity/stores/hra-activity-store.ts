import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HraActivity, HraActivityItem } from '../schemas/hra-activity-schema'
import { HraActivitySchema } from '../schemas/hra-activity-schema'
import { useAuthStore } from '@/models/auth/stores/auth-store'

interface HraActivityStore {
  hraActivity: HraActivity
  isLoading: boolean
  error: string | null
  lastFetchTime: number | null
  fetchHraActivities: () => Promise<void>
  updateHraActivity: (newHraActivity: Partial<HraActivity>) => void
  addHraActivityItem: (item: HraActivityItem) => void
  removeHraActivityItem: (assessmentID: string) => void
}

const defaultHraActivity: HraActivity = {
  assessments: [],
}

const API_URL = 'https://9s7199pwv7.execute-api.us-east-2.amazonaws.com/prod/hra'
const CACHE_LIFETIME = 10 * 60 * 1000

export const useHraActivityStore = create<HraActivityStore>()(
  persist(
    set => ({
      hraActivity: defaultHraActivity,
      isLoading: false,
      error: null,
      lastFetchTime: null,
      fetchHraActivities: async () => {
        const state = useHraActivityStore.getState()
        const now = Date.now()

        if (
          state.lastFetchTime
          && state.hraActivity.assessments.length > 0
          && now - state.lastFetchTime < CACHE_LIFETIME
        ) {
          return
        }

        set({ isLoading: true, error: null })
        try {
          let username = 'esther@helloporter2.com'

          if (import.meta.env.VITE_DEV_TEST !== 'true') {
            const authStore = useAuthStore.getState()
            const currentUsername = authStore.currentUser?.username

            if (!currentUsername) {
              throw new Error('No username available')
            }

            username = currentUsername
          }

          const response = await fetch(`${API_URL}?username=${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          })

          if (!response.ok) {
            throw new Error('Failed to fetch HRA activities')
          }

          const data = await response.json()
          const parsedData = HraActivitySchema.safeParse(data)

          if (!parsedData.success) {
            throw new Error('Invalid data format received from API')
          }

          set({
            hraActivity: parsedData.data,
            isLoading: false,
            lastFetchTime: now,
          })
        }
        catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          })
        }
      },
      updateHraActivity: newHraActivity =>
        set((state) => {
          const updatedHraActivity = { ...state.hraActivity, ...newHraActivity }
          const parsedHraActivity = HraActivitySchema.safeParse(updatedHraActivity)
          if (parsedHraActivity.success) {
            return { hraActivity: parsedHraActivity.data }
          }
          console.error('Invalid HRA activity:', parsedHraActivity.error)
          return state
        }),
      addHraActivityItem: item =>
        set(state => ({
          hraActivity: {
            assessments: [...state.hraActivity.assessments, item],
          },
        })),
      removeHraActivityItem: assessmentID =>
        set(state => ({
          hraActivity: {
            assessments: state.hraActivity.assessments.filter(
              item => item.assessmentID !== assessmentID,
            ),
          },
        })),
    }),
    {
      name: 'hra-activity-storage',
    },
  ),
)
