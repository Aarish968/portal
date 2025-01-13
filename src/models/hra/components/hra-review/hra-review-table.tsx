import { useEffect } from 'react'
import { getAnswerComponent } from '../hra-answers'
import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { findUnansweredQuestions, formatAnswer, getQuestionIndex } from '../../utils/question-utils'

interface HRAReviewTableProps {
  hra: HRA
  isEditing: boolean
  editedAnswers: Record<string, any>
  onAnswerChange: (questionId: string, value: string | string[] | boolean) => void
  onUnansweredQuestionsChange?: (count: number) => void
  isCompleted?: boolean
  isReview: boolean
}

export function HRAReviewTable({ hra, isEditing, editedAnswers, onAnswerChange, onUnansweredQuestionsChange, isCompleted, isReview }: HRAReviewTableProps) {
  const renderAnswer = (question: HRAQuestion, answer: any) => {
    if (!isEditing) {
      return formatAnswer(question, answer)
    }

    const AnswerComponent = getAnswerComponent(question)
    if (AnswerComponent) {
      return <AnswerComponent question={question} answer={answer} onAnswerChange={onAnswerChange} />
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

    const rows = [(
      <tr key={question.questionId}>
        <td className={cellClass}>
          <div className={`:uno: ${indentClass} max-w-[50ch]`}>
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

  const unansweredQuestions = findUnansweredQuestions(hra, editedAnswers)

  useEffect(() => {
    onUnansweredQuestionsChange?.(unansweredQuestions.length)
  }, [unansweredQuestions.length, onUnansweredQuestionsChange])

  return (
    <div className=":uno: space-y-4">
      {isReview && !isCompleted && unansweredQuestions.length > 0 && (
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

      <div className=":uno: mb-10 overflow-x-auto border rounded-lg">
        <table className=":uno: w-full table-fixed">
          {isReview && (
            <thead className=":uno: bg-gray-50">
              <tr>
                <th className=":uno: w-[60%] px-6 py-3 text-left text-sm text-gray-900 font-medium">Question</th>
                <th className=":uno: w-[40%] px-6 py-3 text-left text-sm text-gray-900 font-medium">Answer</th>
              </tr>
            </thead>
          )}
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
