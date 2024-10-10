import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HraActivity, HraActivityItem } from '../schemas/hra-activity-schema'
import { HraActivitySchema } from '../schemas/hra-activity-schema'
import { fakeHraActivities } from '@/models/hra-activity/data/mock-hra-activities'

interface HraActivityStore {
  hraActivity: HraActivity
  updateHraActivity: (newHraActivity: Partial<HraActivity>) => void
  addHraActivityItem: (item: HraActivityItem) => void
  removeHraActivityItem: (id: string) => void
}

const defaultHraActivity: HraActivity = {
  activities: fakeHraActivities,
  totalCount: fakeHraActivities.length,
}

export const useHraActivityStore = create<HraActivityStore>()(
  persist(
    set => ({
      hraActivity: defaultHraActivity,
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
            activities: [...state.hraActivity.activities, item],
            totalCount: state.hraActivity.totalCount + 1,
          },
        })),
      removeHraActivityItem: id =>
        set(state => ({
          hraActivity: {
            activities: state.hraActivity.activities.filter(item => item.id !== id),
            totalCount: state.hraActivity.totalCount - 1,
          },
        })),
    }),
    {
      name: 'hra-activity-storage',
    },
  ),
)
