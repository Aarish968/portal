import { format, isValid } from 'date-fns'
import { MONTHS } from '@/models/hra/utils/date-utils'
import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'

export function formatChoice(choice: string): string {
  return choice === 'NA' ? 'N/A' : choice
}

export function hasLongChoices(choices: string[]): boolean {
  return choices.some(choice => formatChoice(choice).length > 25)
}

export function formatAnswer(question: HRAQuestion, answer: any): string {
  if (answer === undefined || answer === '') {
    return 'Needs Answer'
  }
  if (typeof answer === 'boolean') {
    return answer ? 'Yes' : 'No'
  }
  if (Array.isArray(answer)) {
    return answer.join(', ')
  }
  if (question.answerType === 'Date' && answer) {
    if (question.dateFormat === 'YYYY') {
      return answer
    }
    if (question.dateFormat?.includes('MM') && question.dateFormat?.includes('YYYY') && !question.dateFormat?.includes('DD')) {
      const [month, year] = answer.split('-')
      const monthIndex = Number.parseInt(month) - 1
      return `${MONTHS[monthIndex]} ${year}`
    }
    const date = new Date(answer)
    if (isValid(date)) {
      return format(date, 'PPP')
    }
  }
  return String(answer)
}

export function findUnansweredQuestions(hra: HRA, answers: Record<string, any>): { index: string, text: string }[] {
  const unanswered: { index: string, text: string }[] = []

  const checkQuestion = (question: HRAQuestion, index: number, level = 0, parentIndex?: string) => {
    const answer = answers[question.questionId]
    const answerStr = typeof answer === 'boolean'
      ? (answer ? 'Yes' : 'No')
      : Array.isArray(answer)
        ? answer[0]
        : String(answer)

    const getQuestionIndex = (level: number, index: number, parentIdx?: string) => {
      if (level === 0)
        return `${index + 1}`
      if (level === 1)
        return `${parentIdx}.${String.fromCharCode(97 + index)}`
      return `${parentIdx}.${String.fromCharCode(97 + index)}${level - 1}`
    }

    const currentIndex = getQuestionIndex(level, index, parentIndex)

    if (question.answerType && (answer === undefined || answer === '')) {
      unanswered.push({
        index: currentIndex,
        text: question.questionText,
      })
    }

    if (question.children?.length) {
      question.children.forEach((child: HRAQuestion, childIndex: number) => {
        if (!child.childDependentValue || child.childDependentValue === answerStr) {
          checkQuestion(child, childIndex, level + 1, currentIndex)
        }
      })
    }
  }

  hra.screening.questions.forEach((question, index) => checkQuestion(question, index, 0))
  return unanswered
}

export function getQuestionIndex(level: number, index: number): string {
  if (level === 0)
    return `${index + 1}.`
  if (level === 1)
    return `${String.fromCharCode(97 + index)}.`
  return `${String.fromCharCode(97 + index)}${level - 1}.`
}

export function shouldShowChildQuestions(question: HRAQuestion, answer: string | boolean | string[] | null): boolean {
  if (!question.children?.length) {
    return false
  }

  if (question.answerType === 'Select Multiple' && Array.isArray(answer)) {
    return question.children.some((child: HRAQuestion) => {
      const match = answer.includes(child.childDependentValue)
      return match
    })
  }

  if (question.answerType === 'Yes/No') {
    const answerStr = answer === true ? 'Yes' : 'No'
    return question.children.some((child: HRAQuestion) =>
      !child.childDependentValue || child.childDependentValue === answerStr,
    )
  }

  if (answer !== null) {
    return question.children.some((child: HRAQuestion) =>
      !child.childDependentValue || child.childDependentValue === answer,
    )
  }

  return false
}
