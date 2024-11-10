import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HRAConfirmBar from '../components/hra-confirm-bar'
import { useToast } from '@/base_submod/hooks/use-toast'
import type { HRA } from '@/models/hra/schemas/hra-schema'
import { Button } from '@/base_submod/components/ui/button'

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

  return (
    <div className="relative min-h-screen w-full pb-24">
      <div className="mx-auto w-full p-6 space-y-6">
        <h1 className="mb-8 text-2xl font-bold">Review and Submit HRA</h1>
        <div className="overflow-hidden border rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm text-gray-900 font-medium">Question</th>
                <th className="px-6 py-3 text-left text-sm text-gray-900 font-medium">Answer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hra.screening.questions.map((question, index) => (
                <tr key={question.questionId}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {`${index + 1}. ${question.questionText}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatAnswer(hra.answers[question.questionId])}
                  </td>
                </tr>
              ))}
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
      </div>

      <HRAConfirmBar
        isConfirmed={isConfirmed}
        onConfirmChange={setIsConfirmed}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default HRAReviewView
