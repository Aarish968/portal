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
  getTotalQuestions: () => number
  getCurrentQuestionNumber: () => number
  getDisplayQuestion: () => HRAQuestion | null
  isLastQuestion: () => boolean
  canMoveNext: () => boolean
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

function calculateTotalQuestions(questions: HRAQuestion[]): number {
  return questions.length
}

function calculateCurrentQuestionNumber(
  editQuestionIndex: number | null,
  questionPath: QuestionPath[],
): number {
  if (editQuestionIndex !== null) {
    return editQuestionIndex + 1
  }

  return questionPath[0].questionIndex + 1
}

interface HRAStoreState {
  hra: HRA | null
  isLoading: boolean
  error: string | null
  questionPath: QuestionPath[]
  editQuestionIndex: number | null
  highestCompletedQuestionIndex: number
  lastAssessmentId: string | null
}

export const useHRAStore = create<HRAStore>((set, get) => ({
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
        const nextIndex = state.editQuestionIndex + 1
        if (nextIndex <= state.highestCompletedQuestionIndex) {
          return {
            ...state,
            editQuestionIndex: nextIndex,
          }
        }
        return {
          ...state,
          editQuestionIndex: null,
          questionPath: [{
            questionIndex: state.highestCompletedQuestionIndex + 1,
            parentId: null,
          }],
        }
      }

      const currentQuestion = findQuestionByPath(state.hra.screening.questions, state.questionPath)
      if (!currentQuestion)
        return state

      const currentAnswer = state.hra.answers[currentQuestion.questionId]

      if (shouldShowChildQuestions(currentQuestion, currentAnswer)) {
        return {
          ...state,
          questionPath: [...state.questionPath, { questionIndex: 0, parentId: currentQuestion.questionId }],
          highestCompletedQuestionIndex: Math.max(state.highestCompletedQuestionIndex, state.questionPath[0].questionIndex),
        }
      }

      const nextPath = findNextQuestion(
        state.hra.screening.questions,
        state.hra.answers,
        state.questionPath,
      )

      if (!nextPath) {
        return {
          ...state,
          hra: { ...state.hra, status: 'completed' },
          highestCompletedQuestionIndex: state.questionPath[0].questionIndex,
        }
      }

      return {
        ...state,
        questionPath: nextPath,
        highestCompletedQuestionIndex: Math.max(state.highestCompletedQuestionIndex, state.questionPath[0].questionIndex),
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

  getTotalQuestions: () => {
    const state = get() as HRAStoreState
    if (!state.hra)
      return 0
    return calculateTotalQuestions(state.hra.screening.questions)
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
      const childIndex = state.questionPath[0].childIndex || 0
      const child = currentQuestion.children[childIndex]
      return {
        ...child,
        parentQuestionText: currentQuestion.questionText,
        questionText: child.questionText,
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
}))
