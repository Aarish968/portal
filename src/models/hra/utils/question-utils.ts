import { format, isValid } from 'date-fns'
import { MONTHS } from '@/models/hra/utils/date-utils'
import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'

export function isValidDateInput(value: string, question: HRAQuestion): boolean {
  if (!value)
    return false

  const { dateFormat } = question
  const currentYear = new Date().getFullYear()

  if (dateFormat === 'YYYY') {
    const yearNum = Number.parseInt(value)
    return !Number.isNaN(yearNum) && value.length === 4
  }

  if (dateFormat?.includes('MM') && dateFormat?.includes('YYYY') && !dateFormat?.includes('DD')) {
    const parts = value.split('-')
    if (parts.length !== 2)
      return false

    const [month, year] = parts
    if (!month || !year)
      return false

    const monthNum = Number.parseInt(month)
    const yearNum = Number.parseInt(year)

    if (Number.isNaN(monthNum) || Number.isNaN(yearNum))
      return false

    if (monthNum < 1 || monthNum > 12)
      return false

    if (year.length !== 4)
      return false

    return true
  }

  const parts = value.split('-')
  if (parts.length !== 3)
    return false

  const [month, day, year] = parts
  if (!month || !day || !year)
    return false

  const monthNum = Number.parseInt(month)
  const dayNum = Number.parseInt(day)
  const yearNum = Number.parseInt(year)

  if (Number.isNaN(monthNum) || Number.isNaN(dayNum) || Number.isNaN(yearNum))
    return false

  if (monthNum < 1 || monthNum > 12)
    return false
  if (dayNum < 1 || dayNum > 31)
    return false
  if (year.length !== 4)
    return false

  if (question.questionText?.toLowerCase().includes('date of birth') && yearNum > currentYear)
    return false

  return true
}

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

    if (question.answerType) {
      if (question.answerType === 'Date') {
        if (!answer || !isValidDateInput(answer, question)) {
          unanswered.push({
            index: currentIndex,
            text: question.questionText,
          })
        }
      }
      else if (answer === undefined || answer === '') {
        unanswered.push({
          index: currentIndex,
          text: question.questionText,
        })
      }
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
