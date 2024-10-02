import { create } from 'zustand'
import type { SearchResponse } from '../schemas/member-search-schema'
import { SearchResponseSchema } from '../schemas/member-search-schema'

interface MemberSearchStore {
  searchResults: SearchResponse
  isLoading: boolean
  error: string | null
  lastSearchTime: number | null
  searchMembers: (firstName: string, lastName: string, dateOfBirth: string) => Promise<void>
}

function mockSearchMembers(firstName: string, lastName: string, dateOfBirth: string): SearchResponse {
  return {
    members: [
      { id: '1', firstName, lastName, dateOfBirth, healthPlan: 'Plan A', address: '1234 W Candy Land Lane, Boise, ID 83702', phone: '1-555-555-5555', email: 'samples@gmail.com', hrsStatus: 'Not Started', notes: 'Member struggles with memory loss. Please be patient.' },
      { id: '2', firstName: 'Jane', lastName: 'Doe', dateOfBirth: '1990-01-01', healthPlan: 'Plan B', address: '5678 E Candy Land Lane, Boise, ID 83702', phone: '1-555-555-5555', email: 'samples@gmail.com', hrsStatus: 'Not Started', notes: 'Member struggles with memory loss. Please be patient.' },
    ],
    totalCount: 2,
  }
}

export const useMemberSearchStore = create<MemberSearchStore>(set => ({
  searchResults: { members: [], totalCount: 0 },
  isLoading: false,
  error: null,
  lastSearchTime: null,

  searchMembers: async (firstName: string, lastName: string, dateOfBirth: string) => {
    set({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = mockSearchMembers(firstName, lastName, dateOfBirth)
      const parsedData = SearchResponseSchema.safeParse(response)

      if (parsedData.success) {
        set({
          searchResults: parsedData.data,
          lastSearchTime: Date.now(),
        })
      }
      else {
        console.error('Data validation failed:', parsedData.error.errors)
        set({ error: 'Error: Invalid data format' })
      }
    }
    catch (err) {
      console.error('Error searching members:', err)
      set({
        error: 'Error searching members',
        searchResults: { members: [], totalCount: 0 },
      })
    }
    finally {
      set({ isLoading: false })
    }
  },
}))
