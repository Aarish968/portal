import { create } from 'zustand'
import type { HRA, HRAQuestion } from '../schemas/hra-schema'
import { HRASchema } from '../schemas/hra-schema'
import { useMemberStore } from '@/models/member/stores/member-store'

interface HRAStore {
  hra: HRA | null
  isLoading: boolean
  error: string | null
  currentQuestionIndex: number
  editQuestionIndex: number | null
  highestCompletedQuestionIndex: number
  initializeHRA: () => void
  answerQuestion: (questionId: string, answer: string | boolean) => void
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

  answerQuestion: (questionId: string, answer: string | boolean) => {
    set((state) => {
      if (!state.hra)
        return state
      const newHra = {
        ...state.hra,
        answers: { ...state.hra.answers, [questionId]: answer },
      }
      const currentIndex = state.editQuestionIndex !== null ? state.editQuestionIndex : state.currentQuestionIndex
      return {
        hra: newHra,
        highestCompletedQuestionIndex: Math.max(state.highestCompletedQuestionIndex, currentIndex),
      }
    })
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state
      const nextIndex = state.currentQuestionIndex + 1
      if (nextIndex >= state.hra.questions.length) {
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
