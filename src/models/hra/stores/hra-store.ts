import { create } from 'zustand'
import type { HRA, HRAQuestion } from '../schemas/hra-schema'
import { HRAResponseSchema, HRASchema } from '../schemas/hra-schema'

interface QuestionPath {
  questionIndex: number
  parentId: string | null
  childIndex?: number
}

interface HRAStore {
  hra: HRA | null
  isLoading: boolean
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
}

const API_URL = import.meta.env.VITE_API_URL || ''

export function findQuestionByPath(questions: HRAQuestion[], path: QuestionPath[]): HRAQuestion | null {
  let currentQuestion: HRAQuestion | null = null
  let currentQuestions = questions

  for (const { questionIndex, parentId } of path) {
    if (parentId) {
      const parent = currentQuestions.find(q => q.questionId === parentId)
      if (!parent?.children) {
        return null
      }
      currentQuestions = parent.children
    }

    if (questionIndex >= currentQuestions.length) {
      return null
    }

    currentQuestion = currentQuestions[questionIndex]
    if (!currentQuestion) {
      return null
    }
  }

  return currentQuestion
}

function shouldShowChildQuestions(question: HRAQuestion, answer: string | boolean | string[] | undefined): boolean {
  if (!question.children || question.children.length === 0) {
    return false
  }

  if (!answer) {
    return false
  }

  if (!question.answerType) {
    return true
  }

  if (question.children.some((child: HRAQuestion) => child.childDependentValue)) {
    const answerStr = Array.isArray(answer) ? answer[0] : String(answer)
    return question.children.some((child: HRAQuestion) => child.childDependentValue === answerStr)
  }

  return false
}

function findNextQuestion(
  questions: HRAQuestion[],
  answers: Record<string, string | boolean | string[]>,
  currentPath: QuestionPath[],
): QuestionPath[] | null {
  const currentQuestion = findQuestionByPath(questions, currentPath)
  if (!currentQuestion)
    return null

  if (!currentQuestion.answerType && currentQuestion.children?.length) {
    let currentChildIndex = 0
    for (let i = 0; i < currentQuestion.children.length; i++) {
      if (answers[currentQuestion.children[i].questionId] === undefined) {
        currentChildIndex = i
        break
      }
      if (i === currentQuestion.children.length - 1) {
        currentChildIndex = i
      }
    }

    const currentChild = currentQuestion.children[currentChildIndex]
    if (answers[currentChild.questionId] !== undefined) {
      if (currentChildIndex < currentQuestion.children.length - 1) {
        return [{
          questionIndex: currentPath[0].questionIndex,
          parentId: null,
          childIndex: currentChildIndex + 1,
        }]
      }
      return [{
        questionIndex: currentPath[0].questionIndex + 1,
        parentId: null,
      }]
    }
    return [{
      questionIndex: currentPath[0].questionIndex,
      parentId: null,
      childIndex: currentChildIndex,
    }]
  }

  const currentAnswer = answers[currentQuestion.questionId]

  if (shouldShowChildQuestions(currentQuestion, currentAnswer)) {
    return [...currentPath, { questionIndex: 0, parentId: currentQuestion.questionId }]
  }

  const nextRootIndex = currentPath[0].questionIndex + 1
  if (nextRootIndex < questions.length) {
    return [{ questionIndex: nextRootIndex, parentId: null }]
  }

  return null
}

export const useHRAStore = create<HRAStore>(set => ({
  hra: null,
  isLoading: false,
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
    const currentState = useHRAStore.getState()
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
        throw new Error('Failed to transform HRA data')
      }

      set({
        hra: parsedHRA.data,
        isLoading: false,
        questionPath: [{ questionIndex: 0, parentId: null }],
        editQuestionIndex: null,
        highestCompletedQuestionIndex: -1,
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
      if (!state.hra)
        return state

      const currentQuestion = findQuestionByPath(state.hra.screening.questions, state.questionPath)
      if (!currentQuestion)
        return state

      if (!currentQuestion.answerType && currentQuestion.children?.length) {
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
      }

      const newState = {
        ...state,
        hra: {
          ...state.hra,
          answers: {
            ...state.hra.answers,
            [questionId]: answer,
          },
        },
      }

      if (shouldShowChildQuestions(currentQuestion, answer)) {
        return {
          ...newState,
          questionPath: [...state.questionPath, { questionIndex: 0, parentId: questionId }],
        }
      }

      return newState
    })
  },

  nextQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state

      const nextPath = findNextQuestion(
        state.hra.screening.questions,
        state.hra.answers,
        state.questionPath,
      )

      if (!nextPath) {
        return {
          ...state,
          hra: { ...state.hra, status: 'completed' },
        }
      }

      return {
        ...state,
        questionPath: nextPath,
      }
    })
  },

  previousQuestion: () => {
    set((state) => {
      if (!state.hra)
        return state

      if (state.questionPath.length > 1) {
        return {
          ...state,
          questionPath: state.questionPath.slice(0, -1),
        }
      }

      return {
        ...state,
        questionPath: [{
          questionIndex: Math.max(0, state.questionPath[0].questionIndex - 1),
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
}))
