import { create } from 'zustand'
import type { HRA, HRAQuestion } from '../schemas/hra-schema'
import { HRAResponseSchema, HRASchema } from '../schemas/hra-schema'

interface QuestionPath {
  questionIndex: number
  parentId: string | null
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
  console.log('Finding question by path:', { questions, path })
  let currentQuestion: HRAQuestion | null = null
  let currentQuestions = questions

  for (const { questionIndex, parentId } of path) {
    console.log('Processing path segment:', { questionIndex, parentId, currentQuestions })

    if (parentId) {
      const parent = currentQuestions.find(q => q.questionId === parentId)
      if (!parent?.children) {
        console.log('Parent question not found or has no children:', parentId)
        return null
      }
      currentQuestions = parent.children
    }

    if (questionIndex >= currentQuestions.length) {
      console.log('Question index out of bounds')
      return null
    }

    currentQuestion = currentQuestions[questionIndex]
    if (!currentQuestion) {
      console.log('Question not found at index')
      return null
    }
  }

  console.log('Found question:', currentQuestion)
  return currentQuestion
}

function shouldShowChildQuestions(question: HRAQuestion, answer: string | boolean | string[] | undefined): boolean {
  console.log('Checking if should show children:', { question, answer })

  if (!question.children || question.children.length === 0) {
    console.log('No children available')
    return false
  }

  if (!answer) {
    console.log('No answer provided')
    return false
  }

  if (!question.answerType) {
    console.log('Container question - showing children')
    return true
  }

  const hasOtherOption = question.answerPicklistChoices.some((choice: string) =>
    choice.toLowerCase().includes('other'))
  if (hasOtherOption && String(answer).toLowerCase().includes('other')) {
    console.log('Other option selected - showing children')
    return true
  }

  const isYesNoQuestion = question.answerPicklistChoices.length === 2
    && question.answerPicklistChoices.includes('Yes')
    && question.answerPicklistChoices.includes('No')
  if (isYesNoQuestion && answer === 'Yes') {
    console.log('Yes selected on Yes/No question - showing children')
    return true
  }

  console.log('No conditions met for showing children')
  return false
}

function findNextQuestion(
  questions: HRAQuestion[],
  answers: Record<string, string | boolean | string[]>,
  currentPath: QuestionPath[],
): QuestionPath[] | null {
  console.log('Finding next question:', { currentPath, answers })

  const currentQuestion = findQuestionByPath(questions, currentPath)
  if (!currentQuestion) {
    console.log('Current question not found')
    return null
  }

  const currentAnswer = answers[currentQuestion.questionId]
  console.log('Current question and answer:', { currentQuestion, currentAnswer })

  if (!currentQuestion.answerType && currentQuestion.children) {
    if (currentPath.length === 1) {
      console.log('Container question - showing children')
      return [...currentPath, { questionIndex: 0, parentId: currentQuestion.questionId }]
    }
  }

  if (shouldShowChildQuestions(currentQuestion, currentAnswer)) {
    console.log('Should show children - moving to first child')
    return [...currentPath, { questionIndex: 0, parentId: currentQuestion.questionId }]
  }

  if (currentPath.length > 1) {
    console.log('In nested path, checking siblings')
    const parentPath = currentPath.slice(0, -1)
    const parentQuestion = findQuestionByPath(questions, parentPath)
    const currentLevel = currentPath[currentPath.length - 1]

    if (parentQuestion?.children) {
      if (currentLevel.questionIndex + 1 < parentQuestion.children.length) {
        console.log('Moving to next sibling')
        return [...parentPath, { questionIndex: currentLevel.questionIndex + 1, parentId: parentQuestion.questionId }]
      }
    }

    console.log('No more siblings, going back to parent level')
    const nextRootIndex = parentPath[0].questionIndex + 1
    if (nextRootIndex < questions.length) {
      console.log('Moving to next root question')
      return [{ questionIndex: nextRootIndex, parentId: null }]
    }
  }

  const nextRootIndex = currentPath[0].questionIndex + 1
  if (nextRootIndex < questions.length) {
    console.log('Moving to next root question:', nextRootIndex)
    return [{ questionIndex: nextRootIndex, parentId: null }]
  }

  console.log('No more questions found')
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
    console.log('Answering question:', { questionId, answer })
    set((state) => {
      if (!state.hra)
        return state

      const currentQuestion = findQuestionByPath(state.hra.screening.questions, state.questionPath)
      if (!currentQuestion)
        return state

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
        console.log('Answer triggers child questions - updating path')
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

      console.log('Current state before next:', {
        path: state.questionPath,
        answers: state.hra.answers,
      })

      const nextPath = findNextQuestion(
        state.hra.screening.questions,
        state.hra.answers,
        state.questionPath,
      )

      console.log('Found next path:', nextPath)

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
