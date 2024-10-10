import { create } from 'zustand'
import type { HRA, HRAQuestion } from '../schemas/hra-schema'
import { HRASchema } from '../schemas/hra-schema'
import { useMemberStore } from '@/models/member/stores/member-store'

interface HRAStore {
  hra: HRA | null
  isLoading: boolean
  error: string | null
  initializeHRA: () => void
  answerQuestion: (questionId: string, answer: string | boolean) => void
  nextQuestion: () => void
  previousQuestion: () => void
}

export const useHRAStore = create<HRAStore>((set, _get) => ({
  hra: null,
  isLoading: false,
  error: null,

  initializeHRA: () => {
    const selectedMember = useMemberStore.getState().selectedMember
    if (!selectedMember) {
      set({ error: 'No member selected' })
      return
    }

    const mockQuestions: HRAQuestion[] = [
      { id: '1', text: 'How would you rate your overall health?', type: 'multipleChoice', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
      { id: '2', text: 'Do you smoke?', type: 'boolean' },
      { id: '3', text: 'How many days per week do you exercise?', type: 'text' },
    ]

    const newHRA: HRA = {
      member: selectedMember,
      questions: mockQuestions,
      currentQuestionIndex: 0,
      status: 'inProgress',
      answers: {},
    }

    const parsedHRA = HRASchema.safeParse(newHRA)
    if (parsedHRA.success) {
      set({ hra: parsedHRA.data, error: null })
    }
    else {
      console.error('Invalid HRA data:', parsedHRA.error.errors)
      set({ error: 'Error: Invalid HRA data format' })
    }
  },

  answerQuestion: (questionId: string, answer: string | boolean) => {
    set((state) => {
      if (!state.hra)
        return state
      return {
        hra: {
          ...state.hra,
          answers: { ...state.hra.answers, [questionId]: answer },
        },
      }
    })
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state
      const nextIndex = state.hra.currentQuestionIndex + 1
      if (nextIndex >= state.hra.questions.length) {
        return {
          hra: { ...state.hra, status: 'completed' },
        }
      }
      return {
        hra: { ...state.hra, currentQuestionIndex: nextIndex },
      }
    })
  },

  previousQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state
      const prevIndex = Math.max(0, state.hra.currentQuestionIndex - 1)
      return {
        hra: { ...state.hra, currentQuestionIndex: prevIndex },
      }
    })
  },
}))
