import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import { HRACheckbox } from '../hra-checkbox'
import { Input } from '@/base_submod/components/ui/input'
import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { format } from 'date-fns'
import HRADateSelect from '../hra-date-select'
import { isDateQuestion } from '@/models/hra/utils/question-utils'

interface HRAReviewTableProps {
  hra: HRA
  isEditing: boolean
  editedAnswers: Record<string, any>
  onAnswerChange: (questionId: string, value: string | string[] | boolean) => void
}

export function HRAReviewTable({ hra, isEditing, editedAnswers, onAnswerChange }: HRAReviewTableProps) {
  const formatAnswer = (question: HRAQuestion, answer: any) => {
    if (typeof answer === 'boolean') {
      return answer ? 'Yes' : 'No'
    }
    if (Array.isArray(answer)) {
      return answer.join(', ')
    }
    if (question.answerType === 'Text' && isDateQuestion(question.questionText) && answer) {
      return format(new Date(answer), 'PPP')
    }
    return String(answer)
  }

  const renderAnswer = (question: HRAQuestion, answer: any) => {
    if (!isEditing) {
      return formatAnswer(question, answer)
    }

    if (question.answerType === 'Text' && isDateQuestion(question.questionText)) {
      return (
        <div className=":uno: flex justify-center">
          <HRADateSelect
            value={answer || ''}
            onChange={value => onAnswerChange(question.questionId, value)}
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

  const renderQuestionRow = (question: HRAQuestion, index: number) => {
    const answer = editedAnswers[question.questionId]
    const answerStr = Array.isArray(answer) ? answer[0] : String(answer)

    const hasChildren = question.children?.length > 0
    const showChildren = hasChildren && (
      !question.answerType
      || question.children.some((child: HRAQuestion) => child.childDependentValue === answerStr)
    )

    return (
      <>
        <tr key={question.questionId}>
          <td className=":uno: px-6 py-4 text-sm text-gray-900">
            {`${index + 1}. ${question.questionText}`}
          </td>
          <td className=":uno: px-6 py-4 text-sm text-gray-900">
            {question.answerType ? renderAnswer(question, answer) : ''}
          </td>
        </tr>
        {showChildren && question.children?.map((child: HRAQuestion, childIndex: number) => {
          if (!question.answerType || child.childDependentValue === answerStr) {
            return (
              <tr key={child.questionId}>
                <td className=":uno: px-6 py-4 pl-12 text-sm text-gray-900">
                  {`${String.fromCharCode(97 + childIndex)}. ${child.questionText}`}
                </td>
                <td className=":uno: px-6 py-4 text-sm text-gray-900">
                  {renderAnswer(child, editedAnswers[child.questionId])}
                </td>
              </tr>
            )
          }
          return null
        })}
      </>
    )
  }

  return (
    <div className=":uno: mb-10 overflow-hidden border rounded-lg">
      <table className=":uno: w-full">
        <thead className=":uno: bg-gray-50">
          <tr>
            <th className=":uno: px-6 py-3 text-left text-sm text-gray-900 font-medium">Question</th>
            <th className=":uno: px-6 py-3 text-left text-sm text-gray-900 font-medium">Answer</th>
          </tr>
        </thead>
        <tbody className=":uno: bg-white divide-y divide-gray-200">
          {hra.screening.questions.map((question, index) =>
            renderQuestionRow(question, index),
          )}
        </tbody>
      </table>
    </div>
  )
}
