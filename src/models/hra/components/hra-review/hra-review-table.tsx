import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import { format, isValid } from 'date-fns'
import { HRACheckbox } from '../hra-checkbox'
import HRADateSelect from '../hra-date-select'
import { MONTHS } from '@/models/hra/utils/date-utils'
import { Input } from '@/base_submod/components/ui/input'
import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { useEffect } from 'react'

interface HRAReviewTableProps {
  hra: HRA
  isEditing: boolean
  editedAnswers: Record<string, any>
  onAnswerChange: (questionId: string, value: string | string[] | boolean) => void
  onUnansweredQuestionsChange?: (count: number) => void
}

export function HRAReviewTable({ hra, isEditing, editedAnswers, onAnswerChange, onUnansweredQuestionsChange }: HRAReviewTableProps) {
  const formatAnswer = (question: HRAQuestion, answer: any) => {
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

  const renderAnswer = (question: HRAQuestion, answer: any) => {
    if (!isEditing) {
      return formatAnswer(question, answer)
    }

    if (question.answerType === 'Date') {
      return (
        <div className=":uno: flex justify-center">
          <HRADateSelect
            value={answer || ''}
            onChange={value => onAnswerChange(question.questionId, value)}
            dateFormat={question.dateFormat || 'YYYY-MM-DD'}
          />
        </div>
      )
    }

    if (question.answerType === 'Text') {
      return (
        <Input
          value={String(answer || '')}
          onChange={e => onAnswerChange(question.questionId, e.target.value)}
          className=":uno: w-[200px]"
          placeholder="Enter text..."
        />
      )
    }

    if (question.answerType === 'Select Multiple' && question.answerPicklistChoices) {
      const selectedValues = Array.isArray(answer) ? answer : answer ? [answer] : []

      return (
        <div className=":uno: w-full flex flex-col space-y-2">
          {question.answerPicklistChoices.map((choice: string) => (
            <HRACheckbox
              key={choice}
              id={`${question.questionId}-${choice}`}
              label={choice}
              checked={selectedValues.includes(choice)}
              onCheckedChange={() => {
                const newValues = selectedValues.includes(choice)
                  ? selectedValues.filter(v => v !== choice)
                  : [...selectedValues, choice]
                onAnswerChange(question.questionId, newValues)
              }}
            />
          ))}
        </div>
      )
    }

    if (question.answerType === 'Select Single' && question.answerPicklistChoices) {
      return (
        <Select value={String(answer)} onValueChange={value => onAnswerChange(question.questionId, value)}>
          <SelectTrigger className=":uno: w-[200px]">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {question.answerPicklistChoices.map((choice: string) => (
              <SelectItem key={choice} value={choice}>
                {choice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (question.answerType === 'Yes/No') {
      return (
        <Select
          value={String(answer)}
          onValueChange={value => onAnswerChange(question.questionId, value === 'true')}
        >
          <SelectTrigger className=":uno: w-[200px]">
            <SelectValue placeholder="Select Yes/No" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    return formatAnswer(question, answer)
  }

  const renderQuestionRow = (question: HRAQuestion, index: number, level = 0) => {
    const answer = editedAnswers[question.questionId]
    const answerStr = typeof answer === 'boolean'
      ? (answer ? 'Yes' : 'No')
      : Array.isArray(answer)
        ? answer[0]
        : String(answer)

    const indentClass = [
      '',
      'pl-4',
      'pl-8',
      'pl-12',
      'pl-16',
    ][level] || 'pl-0'

    const isUnanswered = question.answerType && (answer === undefined || answer === '')
    const cellClass = isUnanswered ? ':uno: px-6 py-4 text-sm text-red-700 bg-red-50' : ':uno: px-6 py-4 text-sm text-gray-900'

    const getQuestionIndex = (level: number, index: number) => {
      if (level === 0)
        return `${index + 1}.`
      if (level === 1)
        return `${String.fromCharCode(97 + index)}.`
      return `${String.fromCharCode(97 + index)}${level - 1}.`
    }

    const rows = [(
      <tr key={question.questionId}>
        <td className={cellClass}>
          <div className={`:uno: ${indentClass}`}>
            {`${getQuestionIndex(level, index)} ${question.questionText}`}
          </div>
        </td>
        <td className={cellClass}>
          {question.answerType ? renderAnswer(question, answer) : ''}
        </td>
      </tr>
    )]

    if (question.children?.length) {
      question.children.forEach((child: HRAQuestion, childIndex: number) => {
        if (!child.childDependentValue || child.childDependentValue === answerStr) {
          rows.push(...renderQuestionRow(child, childIndex, level + 1))
        }
      })
    }

    return rows
  }

  const findUnansweredQuestions = () => {
    const unanswered: { index: string, text: string }[] = []

    const checkQuestion = (question: HRAQuestion, index: number, level = 0, parentIndex?: string) => {
      const answer = editedAnswers[question.questionId]
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

  const unansweredQuestions = findUnansweredQuestions()

  useEffect(() => {
    onUnansweredQuestionsChange?.(unansweredQuestions.length)
  }, [unansweredQuestions.length, onUnansweredQuestionsChange])

  return (
    <div className=":uno: space-y-4">
      {unansweredQuestions.length > 0 && (
        <div className=":uno: border-l-4 border-red-400 bg-red-50 p-4">
          <div className=":uno: text-red-700">
            Please answer the following questions:
            <ul className=":uno: mt-2 list-disc pl-8">
              {unansweredQuestions.map(({ index, text }) => (
                <li key={index}>
                  Question
                  {' '}
                  {index}
                  :
                  {' '}
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className=":uno: mb-10 overflow-hidden border rounded-lg">
        <table className=":uno: w-full">
          <thead className=":uno: bg-gray-50">
            <tr>
              <th className=":uno: px-6 py-3 text-left text-sm text-gray-900 font-medium">Question</th>
              <th className=":uno: px-6 py-3 text-left text-sm text-gray-900 font-medium">Answer</th>
            </tr>
          </thead>
          <tbody className=":uno: bg-white divide-y divide-gray-200">
            {hra.screening.questions.flatMap((question, index) =>
              renderQuestionRow(question, index, 0),
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
