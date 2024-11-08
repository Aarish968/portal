import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/base_submod/components/ui/button'
import { Checkbox } from '@/base_submod/components/ui/checkbox'
import { useToast } from '@/base_submod/hooks/use-toast'
import type { HRA } from '@/models/hra/schemas/hra-schema'

interface HRAReviewViewProps {
  hra: HRA
  onSubmit: () => void
  onBack: () => void
}

function HRAReviewView({ hra, onSubmit, onBack }: HRAReviewViewProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = () => {
    toast({
      title: 'HRA Submitted',
      duration: 2000,
    })

    // Allow toast to show before navigating
    setTimeout(() => {
      onSubmit()
      navigate('/hra-activity')
    }, 500)
  }

  return (
    <div className="relative min-h-screen pb-24">
      <div className="mx-auto max-w-4xl w-full p-6 space-y-6">
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
                    {index + 1}
                    .
                    {question.questionText}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {(() => {
                      const answer = hra.answers[question.questionId]
                      if (Array.isArray(answer)) {
                        return answer.join(', ')
                      }
                      return String(answer)
                    })()}
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

      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="mx-auto max-w-4xl w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirm"
              checked={isConfirmed}
              onCheckedChange={checked => setIsConfirmed(checked as boolean)}
            />
            <label
              htmlFor="confirm"
              className="cursor-pointer text-sm text-gray-700"
            >
              I confirm that the following information is accurate and complete.
            </label>
          </div>
          <Button
            className="rounded-full bg-[#4A3880] px-8 hover:bg-[#4A3880]/90"
            disabled={!isConfirmed}
            onClick={handleSubmit}
          >
            Submit HRA
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HRAReviewView
