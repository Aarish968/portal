import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'

export interface QuestionPath {
  questionIndex: number
  parentId: string | null
  childIndex?: number
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
  questions: TransformedQuestion[]
}

function isValidDateString(str: any): boolean {
  if (typeof str !== 'string')
    return false
  const date = new Date(str)
  return date instanceof Date && !Number.isNaN(date.getTime())
}

function formatDate(date: Date, format: string): string {
  const fullYear = date.getFullYear()
  const shortYear = String(fullYear).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
      return `${fullYear}-${month}-${day}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${fullYear}`
    case 'DD/MM/YYYY':
      return `${day}/${month}/${fullYear}`
    case 'MM-DD-YYYY':
      return `${month}-${day}-${fullYear}`
    case 'DD-MM-YYYY':
      return `${day}-${month}-${fullYear}`
    case 'YY/MM':
      return `${shortYear}/${month}`
    case 'YYYY-MM':
      return `${fullYear}-${month}`
    case 'MM-YYYY':
      return `${month}-${fullYear}`
    case 'YYYY/MM':
      return `${fullYear}/${month}`
    case 'MM/YYYY':
      return `${month}/${fullYear}`
    case 'YY-MM':
      return `${shortYear}-${month}`
    case 'MM/YY':
      return `${month}/${shortYear}`
    default:
      return date.toLocaleDateString('en-US')
  }
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

  return {
    id: q.questionId,
    question: q.questionText,
    answerType: q.answerType || '',
    answerValue: processedAnswer ? String(processedAnswer) : '',
    hasTextDetail: q.hasTextDetail || false,
    details: q.answerDetails || '',
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

  return {
    name: hra.screening.name,
    id: hra.screening.screeningId,
    templateId: hra.screening.templateId,
    isCompleted: isCompleted ?? hra.screening.isCompleted,
    isStarted: isStarted ?? hra.screening.isStarted,
    questions,
  }
}
