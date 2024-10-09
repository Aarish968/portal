import { create } from 'zustand'
import type { MyScheduleResult } from '../schemas/my-schedule-schema'
import { MyScheduleResultSchema } from '../schemas/my-schedule-schema'

interface MyScheduleStore {
  scheduleData: MyScheduleResult
  isLoading: boolean
  error: string | null
  fetchSchedule: (practitionerId: string) => Promise<void>
}

function mockFetchSchedule(_practitionerId: string): MyScheduleResult {
  return {
    scheduledPatients: [
      {
        id: '1',
        patientName: 'John Doe',
        appointmentDate: '2023-06-15',
        appointmentTime: '09:00 AM',
        hraStatus: 'Not Started',
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        appointmentDate: '2023-06-15',
        appointmentTime: '10:30 AM',
        hraStatus: 'In Progress',
      },
      {
        id: '3',
        patientName: 'Alice Johnson',
        appointmentDate: '2023-06-16',
        appointmentTime: '02:00 PM',
        hraStatus: 'Not Started',
      },
    ],
    totalCount: 3,
  }
}

export const useMyScheduleStore = create<MyScheduleStore>(set => ({
  scheduleData: { scheduledPatients: [], totalCount: 0 },
  isLoading: false,
  error: null,

  fetchSchedule: async (practitionerId: string) => {
    set({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const response = mockFetchSchedule(practitionerId)
      const parsedData = MyScheduleResultSchema.safeParse(response)

      if (parsedData.success) {
        set({ scheduleData: parsedData.data })
      }
      else {
        console.error('Data validation failed:', parsedData.error.errors)
        set({ error: 'Error: Invalid data format' })
      }
    }
    catch (err) {
      console.error('Error fetching schedule:', err)
      set({
        error: 'Error fetching schedule',
        scheduleData: { scheduledPatients: [], totalCount: 0 },
      })
    }
    finally {
      set({ isLoading: false })
    }
  },
}))
