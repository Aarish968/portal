import { create } from 'zustand'
import type { HRA } from '../schemas/hra-schema'
import { HRAResponseSchema, HRASchema } from '../schemas/hra-schema'

interface HRAStore {
  hra: HRA | null
  isLoading: boolean
  error: string | null
  currentQuestionIndex: number
  editQuestionIndex: number | null
  highestCompletedQuestionIndex: number
  initializeHRA: (assessmentId: string) => Promise<void>
  answerQuestion: (questionId: string, answer: string | boolean | string[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  setEditQuestionIndex: (index: number | null) => void
  returnToCurrentQuestion: () => void
}

const API_URL = import.meta.env.VITE_API_URL || ''

export const useHRAStore = create<HRAStore>(set => ({
  hra: null,
  isLoading: false,
  error: null,
  currentQuestionIndex: 0,
  editQuestionIndex: null,
  highestCompletedQuestionIndex: -1,

  initializeHRA: async (assessmentId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${API_URL}?assessmentId=${assessmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch HRA data')
      }

      const data = await response.json()

      const parsedResponse = HRAResponseSchema.safeParse(data)
      if (!parsedResponse.success) {
        console.error('HRAResponseSchema Parse Error:', parsedResponse.error)
        throw new Error('Invalid HRA data format')
      }

      const responseItem = parsedResponse.data[0]
      if (!responseItem) {
        throw new Error('No HRA data found')
      }

      const screening = responseItem.screenings[0]
      if (!screening) {
        throw new Error('No screening data found')
      }

      const hraData: HRA = {
        screening: {
          ...screening,
          memberId: responseItem.memberId,
          memberLifetimeID: responseItem.memberLifetimeID,
          mbi: responseItem.mbi,
          hContract: responseItem.hContract,
        },
        currentQuestionIndex: 0,
        status: 'notStarted',
        answers: {},
      }

      const parsedHRA = HRASchema.safeParse(hraData)
      if (!parsedHRA.success) {
        console.error('HRASchema Parse Error:', parsedHRA.error)
        throw new Error('Failed to transform HRA data')
      }

      set({
        hra: parsedHRA.data,
        isLoading: false,
        currentQuestionIndex: 0,
        editQuestionIndex: null,
        highestCompletedQuestionIndex: -1,
      })
    }
    catch (error) {
      console.error('HRA Initialization Error:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize HRA',
        isLoading: false,
      })
    }
  },

  answerQuestion: (questionId: string, answer: string | boolean | string[]) => {
    set(state => ({
      hra: state.hra
        ? {
            ...state.hra,
            answers: {
              ...state.hra.answers,
              [questionId]: answer,
            },
          }
        : null,
    }))
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state
      const nextIndex = state.currentQuestionIndex + 1
      if (nextIndex >= state.hra.screening.questions.length) {
        return {
          hra: { ...state.hra, status: 'completed' },
          currentQuestionIndex: state.currentQuestionIndex,
          highestCompletedQuestionIndex: state.currentQuestionIndex,
        }
      }
      return {
        currentQuestionIndex: nextIndex,
        highestCompletedQuestionIndex: Math.max(state.highestCompletedQuestionIndex, nextIndex - 1),
      }
    })
  },

  previousQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state
      return {
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
      }
    })
  },

  setEditQuestionIndex: (index: number | null) => {
    set({ editQuestionIndex: index })
  },

  returnToCurrentQuestion: () => {
    set(state => ({
      editQuestionIndex: null,
      currentQuestionIndex: state.highestCompletedQuestionIndex + 1,
    }))
  },
}))
