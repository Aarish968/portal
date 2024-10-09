import { create } from 'zustand'
import type { MemberHistoryResult } from '../schemas/member-history-schema'
import { MemberHistoryResultSchema } from '../schemas/member-history-schema'

interface PractitionerScreeningHistoryStore {
  screeningHistory: MemberHistoryResult
  isLoading: boolean
  error: string | null
  fetchScreeningHistory: (practitionerId: string) => Promise<void>
}

function mockFetchScreeningHistory(_practitionerId: string): MemberHistoryResult {
  return {
    screenings: [
      {
        id: '1',
        memberId: 'M001',
        memberName: 'John Doe',
        dateOfScreening: '2023-03-15',
        screeningType: 'Annual Wellness Visit',
        result: 'Completed',
        notes: 'Patient showed improvement in cognitive function.',
      },
      {
        id: '2',
        memberId: 'M002',
        memberName: 'Jane Smith',
        dateOfScreening: '2023-02-01',
        screeningType: 'Health Risk Assessment',
        result: 'Incomplete',
        notes: 'Patient requested to reschedule due to illness.',
      },
    ],
    totalCount: 2,
  }
}

export const usePractitionerScreeningHistoryStore = create<PractitionerScreeningHistoryStore>(set => ({
  screeningHistory: { screenings: [], totalCount: 0 },
  isLoading: false,
  error: null,

  fetchScreeningHistory: async (practitionerId: string) => {
    set({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = mockFetchScreeningHistory(practitionerId)
      const parsedData = MemberHistoryResultSchema.safeParse(response)

      if (parsedData.success) {
        set({ screeningHistory: parsedData.data })
      }
      else {
        console.error('Data validation failed:', parsedData.error.errors)
        set({ error: 'Error: Invalid data format' })
      }
    }
    catch (err) {
      console.error('Error fetching screening history:', err)
      set({
        error: 'Error fetching screening history',
        screeningHistory: { screenings: [], totalCount: 0 },
      })
    }
    finally {
      set({ isLoading: false })
    }
  },
}))
