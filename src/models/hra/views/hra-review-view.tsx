import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HRAConfirmBar from '../components/hra-confirm-bar'
import { useToast } from '@/base_submod/hooks/use-toast'
import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { Button } from '@/base_submod/components/ui/button'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'

interface HRAReviewViewProps {
  hra: HRA
  onSubmit: () => void
  onBack: () => void
}

function HRAReviewView({ hra, onSubmit, onBack }: HRAReviewViewProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const formatAnswer = (answer: any) => {
    if (typeof answer === 'boolean') {
      return answer ? 'Yes' : 'No'
    }
    if (Array.isArray(answer)) {
      return answer.join(', ')
    }
    return String(answer)
  }

  const handleSubmit = () => {
    toast({
      title: 'HRA Submitted',
      duration: 2000,
    })

    setTimeout(() => {
      onSubmit()
      navigate('/hra-activity')
    }, 500)
  }

  const renderQuestionRow = (question: HRAQuestion, index: number) => {
    const answer = hra.answers[question.questionId]
    const answerStr = Array.isArray(answer) ? answer[0] : String(answer)

    const hasChildren = question.children?.length > 0
    const showChildren = hasChildren && (
      !question.answerType
      || question.children.some((child: HRAQuestion) => child.childDependentValue === answerStr)
    )

    return (
      <>
        <tr key={question.questionId}>
          <td className="px-6 py-4 text-sm text-gray-900">
            {`${index + 1}. ${question.questionText}`}
          </td>
          <td className="px-6 py-4 text-sm text-gray-900">
            {question.answerType ? formatAnswer(answer) : ''}
          </td>
        </tr>
        {showChildren && question.children?.map((child: HRAQuestion, childIndex: number) => {
          if (!question.answerType || child.childDependentValue === answerStr) {
            return (
              <tr key={child.questionId}>
                <td className="px-6 py-4 pl-12 text-sm text-gray-900">
                  {`${String.fromCharCode(97 + childIndex)}. ${child.questionText}`}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatAnswer(hra.answers[child.questionId])}
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
    <BasePractitionerView title="Review and Submit HRA">
      <div className="mb-10 overflow-hidden border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-900 font-medium">Question</th>
              <th className="px-6 py-3 text-left text-sm text-gray-900 font-medium">Answer</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hra.screening.questions.map((question, index) =>
              renderQuestionRow(question, index),
            )}
          </tbody>
        </table>
      </div>

      <Button
        variant="outline"
        onClick={onBack}
        className="mt-6"
      >
        Back to Questions
      </Button>

      <HRAConfirmBar
        isConfirmed={isConfirmed}
        onConfirmChange={setIsConfirmed}
        onSubmit={handleSubmit}
      />
    </BasePractitionerView>
  )
}

export default HRAReviewView
