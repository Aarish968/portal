import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { formatDate, isValidDateString } from '@/utils/strings'

export interface QuestionPath {
  questionIndex: number
  parentId: string | null
  childIndex?: number
}

export function extractAnswers(questions: HRAQuestion[]): Record<string, string | boolean | string[]> {
  const answers: Record<string, string | boolean | string[]> = {}
  questions.forEach((q) => {
    if (q.answer !== null) {
      if (q.answerType === 'Yes/No') {
        answers[q.questionId] = q.answer === 'Yes'
      }
      else if (q.answerType === 'Select Multiple') {
        answers[q.questionId] = q.answer.split(',').map((a: string) => a.trim())
      }
      else {
        answers[q.questionId] = q.answer
      }
    }
    if (q.children) {
      Object.assign(answers, extractAnswers(q.children))
    }
  })
  return answers
}

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

export function findFirstUnansweredPath(questions: HRAQuestion[], answers: Record<string, any>): QuestionPath[] {
  const checkQuestion = (question: HRAQuestion, currentPath: QuestionPath[]): QuestionPath[] | null => {
    if (question.answerType && answers[question.questionId] === undefined) {
      return currentPath
    }

    if (question.children) {
      for (let i = 0; i < question.children.length; i++) {
        const child = question.children[i]
        const shouldShow = !child.childDependentValue
          || (answers[question.questionId] !== undefined
          && String(answers[question.questionId]) === child.childDependentValue)

        if (shouldShow) {
          const childPath = checkQuestion(child, [
            ...currentPath,
            { questionIndex: i, parentId: question.questionId },
          ])
          if (childPath) {
            return childPath
          }
        }
      }
    }
    return null
  }

  for (let i = 0; i < questions.length; i++) {
    const path = checkQuestion(questions[i], [{ questionIndex: i, parentId: null }])
    if (path) {
      return path
    }
  }

  return [{ questionIndex: questions.length - 1, parentId: null }]
}

export function shouldShowChildQuestions(question: HRAQuestion, answer: string | boolean | string[] | undefined): boolean {
  if (!question.children || question.children.length === 0) {
    return false
  }

  if (question.children.some((child: HRAQuestion) => !child.childDependentValue)) {
    return true
  }

  if (!answer) {
    return false
  }

  if (question.answerType === 'Select Multiple' && Array.isArray(answer)) {
    return question.children.some((child: HRAQuestion) =>
      answer.includes(child.childDependentValue),
    )
  }

  if (question.answerType === 'Select Single') {
    return question.children.some((child: HRAQuestion) =>
      !child.childDependentValue || child.childDependentValue === answer,
    )
  }

  if (typeof answer === 'boolean') {
    const answerStr = answer ? 'Yes' : 'No'
    return question.children.some((child: HRAQuestion) =>
      !child.childDependentValue || child.childDependentValue === answerStr,
    )
  }

  return false
}

export function calculateCurrentQuestionNumber(
  editQuestionIndex: number | null,
  questionPath: QuestionPath[],
): number {
  if (editQuestionIndex !== null) {
    return editQuestionIndex + 1
  }

  return questionPath[0].questionIndex + 1
}

interface Question {
  questionId: string
  questionText: string
  answerType: string | null
  dateFormat?: string | null
  hasTextDetail?: boolean
  answerDetails?: string | null
  children?: Question[]
}

type AnswerValue = string | boolean | string[] | Date | null

interface TransformedQuestion {
  id: string
  question: string
  answerType: string | null
  answerValue: string
  hasTextDetail: boolean
  details: string
}

export interface TransformedHRA {
  name: string
  id: string
  templateId: string | null
  isCompleted: boolean
  isStarted: boolean
  completionDate?: string
  questions: TransformedQuestion[]
}

function processQuestion(hra: HRA, q: Question): TransformedQuestion {
  const answer = hra.answers[q.questionId]
  let processedAnswer: AnswerValue = answer || null

  if (q.answerType === 'Yes/No' && typeof answer === 'boolean') {
    processedAnswer = answer ? 'Yes' : 'No'
  }
  else if (q.answerType === 'Date' && answer && q.dateFormat && isValidDateString(answer)) {
    const date = new Date(answer as string)
    processedAnswer = formatDate(date, q.dateFormat)
  }
  else if (q.answerType === 'Select Multiple' && Array.isArray(answer)) {
    processedAnswer = answer.join(', ')
  }

  const answerValue = processedAnswer ? String(processedAnswer) : ''
  const details = q.answerType === 'Text' ? answerValue : (q.answerDetails || '')

  return {
    id: q.questionId,
    question: q.questionText,
    answerType: q.answerType || '',
    answerValue,
    hasTextDetail: q.hasTextDetail || false,
    details,
  }
}

function flattenQuestions(questions: Question[]): Question[] {
  return questions.flatMap((q) => {
    const result: Question[] = [q]
    if (q.children) {
      result.push(...flattenQuestions(q.children))
    }
    return result
  })
}

export function transformHRAData(
  hra: HRA,
  isStarted?: boolean,
  isCompleted?: boolean,
): TransformedHRA {
  const questions = flattenQuestions(hra.screening.questions)
    .map(q => processQuestion(hra, q))
    .filter(q => q.answerValue !== '')

  const finalIsCompleted = isCompleted ?? hra.screening.isCompleted

  return {
    name: hra.screening.name,
    id: hra.screening.screeningId,
    templateId: hra.screening.templateId,
    isCompleted: finalIsCompleted,
    isStarted: isStarted ?? hra.screening.isStarted,
    completionDate: finalIsCompleted ? formatDate(new Date(), 'YYYY-MM-DD') : undefined,
    questions,
  }
}
