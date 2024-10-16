import { useEffect } from 'react'
import { useMemberStore } from '@/models/member/stores/member-store'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import HraProgress from '@/models/hra/components/hra-progress'

interface HRAStartViewProps {
  onContinue: () => void
  onCancel: () => void
}

function HRAStartView({ onContinue, onCancel }: HRAStartViewProps) {
  const { selectedMember } = useMemberStore()
  const { hra, currentQuestionIndex, initializeHRA } = useHRAStore()

  useEffect(() => {
    initializeHRA()
  }, [initializeHRA])

  if (!selectedMember) {
    onCancel()
    return null
  }

  if (!hra) {
    return <div>Loading HRA...</div>
  }

  const totalQuestions = hra.questions.length

  return (
    <div className=":uno: mt-12 min-h-screen w-full flex flex-col items-center">
      <div className="mx-auto max-w-2xl w-full">
        <HraProgress
          currentQuestion={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
        <div className=":uno: mt-6 text-center text-balance">
          <h1 className="mb-4 text-32px font-bold">Let's get started</h1>
          <p className="mb-8">
            You are about to complete a HRA for the below member. Please make sure you have the correct member before proceeding.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p>
                <strong>Name:</strong>
                {' '}
                {selectedMember.firstName}
                {' '}
                {selectedMember.lastName}
              </p>
              <p>
                <strong>Date of Birth:</strong>
                {' '}
                {selectedMember.dateOfBirth}
              </p>
              <p>
                <strong>Health Plan:</strong>
                {' '}
                {selectedMember.healthPlan}
              </p>
              <p>
                <strong>Address:</strong>
                {' '}
                {selectedMember.address}
              </p>
              <p>
                <strong>Phone:</strong>
                {' '}
                {selectedMember.phone}
              </p>
              <p>
                <strong>Email:</strong>
                {' '}
                {selectedMember.email}
              </p>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <div>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
              </div>
              <div>
                <Button onClick={onContinue}>Continue</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HRAStartView
