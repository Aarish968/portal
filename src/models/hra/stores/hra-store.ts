import { create } from 'zustand'
import type { HRA, HRAQuestion } from '../schemas/hra-schema'
import { HRAResponseSchema, HRASchema } from '../schemas/hra-schema'
import { useAuthStore } from '@/models/auth/stores/auth-store'
import { finished } from './finished-healthyman'
import {
  type QuestionPath,
  calculateCurrentQuestionNumber,
  extractAnswers,
  findFirstUnansweredPath,
  findQuestionByPath,
  shouldShowChildQuestions,
  transformHRAData,
} from '@/models/hra/utils/hra-store-utils'
import { HRA_SERVICE_API_URL } from '@/data/api-url'

interface HRAStore {
  hra: HRA | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  questionPath: QuestionPath[]
  editQuestionIndex: number | null
  highestCompletedQuestionIndex: number
  lastAssessmentId: string | null
  initializeHRA: (assessmentId: string) => Promise<void>
  answerQuestion: (questionId: string, answer: string | boolean | string[]) => void
  nextQuestion: () => void
  previousQuestion: () => void
  setEditQuestionIndex: (index: number | null) => void
  returnToCurrentQuestion: () => void
  resetQuestionState: () => void
  getTotalQuestions: () => number
  getCurrentQuestionNumber: () => number
  getDisplayQuestion: () => HRAQuestion | null
  isLastQuestion: () => boolean
  canMoveNext: () => boolean
  saveHRA: (isStarted?: boolean, isCompleted?: boolean) => Promise<void>
  isHraCompleted: () => boolean
}

interface HRAStoreState {
  hra: HRA | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  questionPath: QuestionPath[]
  editQuestionIndex: number | null
  highestCompletedQuestionIndex: number
  lastAssessmentId: string | null
}

export const useHRAStore = create<HRAStore>((set, get) => ({
  hra: null,
  isLoading: false,
  isSaving: false,
  error: null,
  questionPath: [{ questionIndex: 0, parentId: null }],
  editQuestionIndex: null,
  highestCompletedQuestionIndex: -1,
  lastAssessmentId: null,

  resetQuestionState: () => {
    set({
      questionPath: [{ questionIndex: 0, parentId: null }],
      editQuestionIndex: null,
      highestCompletedQuestionIndex: -1,
    })
  },

  initializeHRA: async (assessmentId: string) => {
    const currentState = get() as HRAStoreState
    if (currentState.lastAssessmentId === assessmentId && currentState.hra && !currentState.error) {
      return
    }

    set({
      isLoading: true,
      error: null,
      hra: null,
      questionPath: [{ questionIndex: 0, parentId: null }],
      editQuestionIndex: null,
      highestCompletedQuestionIndex: -1,
      lastAssessmentId: null,
    })

    try {
      const USE_FINISHED_DATA = false

      if (USE_FINISHED_DATA) {
        const responseItem = finished[0]
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

        hraData.answers = extractAnswers(screening.questions)

        const parsedHRA = HRASchema.safeParse(hraData)
        if (!parsedHRA.success) {
          throw new Error('Failed to transform HRA data')
        }

        const questionPath = findFirstUnansweredPath(screening.questions, hraData.answers)
        const highestAnsweredIndex = Math.max(0, questionPath[0].questionIndex - 1)

        set({
          hra: parsedHRA.data,
          isLoading: false,
          questionPath,
          editQuestionIndex: null,
          highestCompletedQuestionIndex: highestAnsweredIndex,
          lastAssessmentId: assessmentId,
        })
        return
      }

      const authStore = useAuthStore.getState()
      if (!authStore.idToken) {
        await new Promise<void>((resolve) => {
          const handler = () => {
            window.removeEventListener('auth-ready', handler)
            resolve()
          }
          window.addEventListener('auth-ready', handler)
        })
      }

      const response = await fetch(`${HRA_SERVICE_API_URL}/hra/get`, {
        method: 'POST',
        headers: await useAuthStore.getState().getAuthHeaders(),
        body: JSON.stringify({ assessmentId }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch HRA data')
      }

      const data = await response.json()
      const parsedResponse = HRAResponseSchema.safeParse(data)
      if (!parsedResponse.success) {
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

      hraData.answers = extractAnswers(screening.questions)

      const parsedHRA = HRASchema.safeParse(hraData)
      if (!parsedHRA.success) {
        throw new Error('Failed to transform HRA data')
      }

      const questionPath = findFirstUnansweredPath(screening.questions, hraData.answers)
      const highestAnsweredIndex = Math.max(0, questionPath[0].questionIndex - 1)

      set({
        hra: parsedHRA.data,
        isLoading: false,
        questionPath,
        editQuestionIndex: null,
        highestCompletedQuestionIndex: highestAnsweredIndex,
        lastAssessmentId: assessmentId,
      })
    }
    catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize HRA',
        isLoading: false,
        hra: null,
        questionPath: [{ questionIndex: 0, parentId: null }],
        editQuestionIndex: null,
        highestCompletedQuestionIndex: -1,
        lastAssessmentId: null,
      })
    }
  },

  answerQuestion: (questionId: string, answer: string | boolean | string[]) => {
    set((state) => {
      if (!state.hra) {
        return state
      }

      const currentQuestion = findQuestionByPath(state.hra.screening.questions, state.questionPath)
      if (!currentQuestion) {
        return state
      }

      return {
        ...state,
        hra: {
          ...state.hra,
          answers: {
            ...state.hra.answers,
            [questionId]: answer,
          },
        },
      }
    })
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state

      if (state.editQuestionIndex !== null) {
        if (state.editQuestionIndex < state.highestCompletedQuestionIndex) {
          return {
            ...state,
            editQuestionIndex: state.editQuestionIndex + 1,
          }
        }
        else {
          return {
            ...state,
            editQuestionIndex: null,
            questionPath: [{
              questionIndex: state.highestCompletedQuestionIndex + 1,
              parentId: null,
            }],
          }
        }
      }

      const currentQuestion = findQuestionByPath(state.hra.screening.questions, state.questionPath)
      if (!currentQuestion)
        return state

      const currentAnswer = state.hra.answers[currentQuestion.questionId]

      if (currentQuestion.answerType === 'Select Multiple' && currentQuestion.children?.length) {
        const selectedAnswers = Array.isArray(currentAnswer) ? currentAnswer : []
        const hasMatchingChild = currentQuestion.children.some((child: HRAQuestion) =>
          selectedAnswers.includes(child.childDependentValue),
        )

        if (hasMatchingChild) {
          return {
            ...state,
            questionPath: [
              ...state.questionPath,
              { questionIndex: 0, parentId: currentQuestion.questionId },
            ],
          }
        }
      }
      else if (shouldShowChildQuestions(currentQuestion, currentAnswer) && currentQuestion.children?.length) {
        return {
          ...state,
          questionPath: [
            ...state.questionPath,
            { questionIndex: 0, parentId: currentQuestion.questionId },
          ],
        }
      }

      if (state.questionPath.length > 1) {
        const parentPath = state.questionPath.slice(0, -1)
        const parentQuestion = findQuestionByPath(state.hra.screening.questions, parentPath)
        if (!parentQuestion?.children)
          return state

        const currentChildIndex = state.questionPath[state.questionPath.length - 1].questionIndex

        if (currentChildIndex < parentQuestion.children.length - 1) {
          const nextChild = parentQuestion.children[currentChildIndex + 1]
          const parentAnswer = state.hra.answers[parentQuestion.questionId]

          if (parentQuestion.answerType === 'Select Multiple') {
            const selectedAnswers = Array.isArray(parentAnswer) ? parentAnswer : []
            if (!nextChild.childDependentValue || selectedAnswers.includes(nextChild.childDependentValue)) {
              return {
                ...state,
                questionPath: [
                  ...parentPath,
                  {
                    questionIndex: currentChildIndex + 1,
                    parentId: parentQuestion.questionId,
                  },
                ],
              }
            }
          }
          else {
            const answerStr = typeof parentAnswer === 'boolean' ? (parentAnswer ? 'Yes' : 'No') : parentAnswer
            if (!nextChild.childDependentValue || nextChild.childDependentValue === answerStr) {
              return {
                ...state,
                questionPath: [
                  ...parentPath,
                  {
                    questionIndex: currentChildIndex + 1,
                    parentId: parentQuestion.questionId,
                  },
                ],
              }
            }
          }
        }

        if (state.questionPath.length > 2) {
          for (let i = state.questionPath.length - 2; i >= 0; i--) {
            const ancestorPath = state.questionPath.slice(0, i)
            const ancestorQuestion = findQuestionByPath(state.hra.screening.questions, ancestorPath)
            if (!ancestorQuestion?.children)
              continue

            const currentAncestorIndex = state.questionPath[i].questionIndex

            if (currentAncestorIndex < ancestorQuestion.children.length - 1) {
              const nextAncestorChild = ancestorQuestion.children[currentAncestorIndex + 1]
              const ancestorAnswer = state.hra.answers[ancestorQuestion.questionId]

              if (ancestorQuestion.answerType === 'Select Multiple') {
                const selectedAnswers = Array.isArray(ancestorAnswer) ? ancestorAnswer : []
                if (!nextAncestorChild.childDependentValue || selectedAnswers.includes(nextAncestorChild.childDependentValue)) {
                  return {
                    ...state,
                    questionPath: [
                      ...ancestorPath,
                      {
                        questionIndex: currentAncestorIndex + 1,
                        parentId: ancestorQuestion.questionId,
                      },
                    ],
                  }
                }
              }
              else {
                const answerStr = typeof ancestorAnswer === 'boolean' ? (ancestorAnswer ? 'Yes' : 'No') : ancestorAnswer
                if (!nextAncestorChild.childDependentValue || nextAncestorChild.childDependentValue === answerStr) {
                  return {
                    ...state,
                    questionPath: [
                      ...ancestorPath,
                      {
                        questionIndex: currentAncestorIndex + 1,
                        parentId: ancestorQuestion.questionId,
                      },
                    ],
                  }
                }
              }
            }
          }
        }

        return {
          ...state,
          questionPath: [{
            questionIndex: state.questionPath[0].questionIndex + 1,
            parentId: null,
          }],
        }
      }

      if (!currentQuestion.answerType && currentQuestion.children?.length) {
        return {
          ...state,
          questionPath: [
            ...state.questionPath,
            { questionIndex: 0, parentId: currentQuestion.questionId },
          ],
        }
      }

      return {
        ...state,
        questionPath: [{
          questionIndex: state.questionPath[0].questionIndex + 1,
          parentId: null,
        }],
      }
    })
  },

  previousQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state

      if (state.editQuestionIndex !== null) {
        if (state.editQuestionIndex > 0) {
          return {
            ...state,
            editQuestionIndex: state.editQuestionIndex - 1,
          }
        }
        return state
      }

      if (state.questionPath.length > 1) {
        const parentPath = state.questionPath.slice(0, -1)
        const parentQuestion = findQuestionByPath(state.hra.screening.questions, parentPath)
        if (!parentQuestion)
          return state

        const currentChildIndex = state.questionPath[state.questionPath.length - 1].questionIndex

        if (currentChildIndex > 0) {
          const previousChild = parentQuestion.children?.[currentChildIndex - 1]
          if (!previousChild)
            return state

          const previousAnswer = state.hra.answers[previousChild.questionId]
          if (shouldShowChildQuestions(previousChild, previousAnswer) && previousChild.children?.length) {
            return {
              ...state,
              questionPath: [
                ...parentPath,
                { questionIndex: currentChildIndex - 1, parentId: parentQuestion.questionId },
                { questionIndex: previousChild.children.length - 1, parentId: previousChild.questionId },
              ],
            }
          }

          return {
            ...state,
            questionPath: [
              ...parentPath,
              { questionIndex: currentChildIndex - 1, parentId: parentQuestion.questionId },
            ],
          }
        }

        return {
          ...state,
          questionPath: parentPath,
        }
      }

      if (state.questionPath[0].questionIndex === 0) {
        return state
      }

      const previousIndex = state.questionPath[0].questionIndex - 1
      const previousQuestion = state.hra.screening.questions[previousIndex]

      if (previousQuestion?.children?.length) {
        const lastChild = previousQuestion.children[previousQuestion.children.length - 1]
        const lastChildAnswer = state.hra.answers[lastChild.questionId]

        if (shouldShowChildQuestions(lastChild, lastChildAnswer) && lastChild.children?.length) {
          return {
            ...state,
            questionPath: [
              { questionIndex: previousIndex, parentId: null },
              { questionIndex: previousQuestion.children.length - 1, parentId: previousQuestion.questionId },
              { questionIndex: lastChild.children.length - 1, parentId: lastChild.questionId },
            ],
          }
        }

        return {
          ...state,
          questionPath: [
            { questionIndex: previousIndex, parentId: null },
            { questionIndex: previousQuestion.children.length - 1, parentId: previousQuestion.questionId },
          ],
        }
      }

      return {
        ...state,
        questionPath: [{
          questionIndex: previousIndex,
          parentId: null,
        }],
      }
    })
  },

  setEditQuestionIndex: (index: number | null) => {
    set({ editQuestionIndex: index })
  },

  returnToCurrentQuestion: () => {
    set(state => ({
      editQuestionIndex: null,
      questionPath: [{ questionIndex: state.highestCompletedQuestionIndex + 1, parentId: null }],
    }))
  },

  getTotalQuestions: () => {
    const state = get() as HRAStoreState
    if (!state.hra)
      return 0
    return state.hra.screening.questions.length
  },

  getCurrentQuestionNumber: () => {
    const state = get() as HRAStoreState
    if (!state.hra)
      return 0
    return calculateCurrentQuestionNumber(
      state.editQuestionIndex,
      state.questionPath,
    )
  },

  getDisplayQuestion: () => {
    const state = get()
    if (!state.hra)
      return null

    const currentQuestion = state.editQuestionIndex !== null
      ? state.hra.screening.questions[state.editQuestionIndex]
      : findQuestionByPath(state.hra.screening.questions, state.questionPath)

    if (!currentQuestion)
      return null

    if (!currentQuestion.answerType && currentQuestion.children?.length) {
      const childIndex = state.questionPath.length > 1
        ? state.questionPath[state.questionPath.length - 1].questionIndex
        : 0
      const child = currentQuestion.children[childIndex]
      return {
        ...child,
        parentQuestionText: currentQuestion.questionText,
        questionText: child.questionText,
      }
    }

    if (state.questionPath.length > 1) {
      const parentQuestion = findQuestionByPath(state.hra.screening.questions, state.questionPath.slice(0, -1))
      if (parentQuestion && !parentQuestion.answerType) {
        return {
          ...currentQuestion,
          parentQuestionText: parentQuestion.questionText,
          questionText: currentQuestion.questionText,
        }
      }
    }

    return currentQuestion
  },

  isLastQuestion: () => {
    const state = get()
    if (!state.hra)
      return false

    return state.editQuestionIndex !== null
      ? state.editQuestionIndex === state.hra.screening.questions.length - 1
      : state.questionPath[0].questionIndex === state.hra.screening.questions.length - 1 && state.questionPath.length === 1
  },

  canMoveNext: () => {
    const state = get()
    const displayQuestion = state.getDisplayQuestion()
    if (!state.hra || !displayQuestion)
      return false

    return state.isLastQuestion()
      ? state.hra.answers[displayQuestion.questionId] !== undefined
      : state.hra.answers[displayQuestion.questionId] !== undefined
  },

  saveHRA: async (isStarted?: boolean, isCompleted?: boolean) => {
    const state = get()
    if (!state.hra || !state.lastAssessmentId) {
      throw new Error('No HRA data to save')
    }

    set({ isSaving: true, error: null })

    try {
      const authStore = useAuthStore.getState()
      if (!authStore.idToken) {
        await new Promise<void>((resolve) => {
          const handler = () => {
            window.removeEventListener('auth-ready', handler)
            resolve()
          }
          window.addEventListener('auth-ready', handler)
        })
      }

      const transformedData = transformHRAData(state.hra, isStarted, isCompleted)

      const response = await fetch(`${HRA_SERVICE_API_URL}/hra`, {
        method: 'POST',
        headers: await useAuthStore.getState().getAuthHeaders(),
        body: JSON.stringify(transformedData),
      })

      if (!response.ok) {
        throw new Error('Failed to save HRA data')
      }

      set({ isSaving: false })
    }
    catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to save HRA data',
        isSaving: false,
      })
      throw error
    }
  },

  isHraCompleted: () => {
    const state = get()
    if (!state.hra)
      return false

    return state.editQuestionIndex !== null
      ? state.editQuestionIndex === state.hra.screening.questions.length - 1
      : state.questionPath[0].questionIndex === state.hra.screening.questions.length - 1 && state.questionPath.length === 1
  },
}))
