import { create } from 'zustand'
import type { HRA, HRAScreening } from '../schemas/hra-schema'
import { HRASchema } from '../schemas/hra-schema'
import { fakeHRA } from '../data/fakeHRA'

interface HRAStore {
  hra: HRA | null
  isLoading: boolean
  error: string | null
  currentQuestionIndex: number
  editQuestionIndex: number | null
  highestCompletedQuestionIndex: number
  initializeHRA: (screening?: HRAScreening) => void
  answerQuestion: (questionId: string, answer: string | boolean | string[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  setEditQuestionIndex: (index: number | null) => void
  returnToCurrentQuestion: () => void
}

export const useHRAStore = create<HRAStore>((set, _get) => ({
  hra: null,
  isLoading: false,
  error: null,
  currentQuestionIndex: 0,
  editQuestionIndex: null,
  highestCompletedQuestionIndex: -1,

  initializeHRA: (screening = fakeHRA) => {
    const newHRA: HRA = {
      screening,
      currentQuestionIndex: 0,
      status: 'inProgress',
      answers: {},
    }

    const parsedHRA = HRASchema.safeParse(newHRA)
    if (parsedHRA.success) {
      set({
        hra: parsedHRA.data,
        error: null,
        currentQuestionIndex: 0,
        editQuestionIndex: null,
        highestCompletedQuestionIndex: -1,
      })
    }
    else {
      console.error('Invalid HRA data:', parsedHRA.error.errors)
      set({ error: 'Error: Invalid HRA data format' })
    }
  },

  answerQuestion: (questionId: string, answer: string | boolean | string[]) => {
    set(state => ({
      hra: {
        ...state.hra!,
        answers: {
          ...state.hra!.answers,
          [questionId]: answer,
        },
      },
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
      const prevIndex = Math.max(0, state.currentQuestionIndex - 1)
      return {
        currentQuestionIndex: prevIndex,
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
