import { useEffect, useRef } from 'react'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import { Button } from '@/base_submod/components/ui/button'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { useMemberStore } from '@/models/member/stores/member-store'

interface HRAStartViewProps {
  onContinue: () => void
  onCancel: () => void
}

function HRAStartView({ onContinue, onCancel }: HRAStartViewProps) {
  const { selectedMember } = useMemberStore()
  const { initializeHRA, isLoading, error, hra } = useHRAStore()
  const initRef = useRef(false)

  useEffect(() => {
    if (selectedMember?.assessmentId && !initRef.current) {
      initRef.current = true
      initializeHRA(selectedMember.assessmentId)
    }
  }, [selectedMember])

  const handleContinue = () => {
    if (hra) {
      onContinue()
    }
  }

  if (!selectedMember) {
    return null
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500">
          Error loading HRA:
          {error}
        </p>
        <Button onClick={onCancel}>Back to HRA Activity</Button>
      </div>
    )
  }

  return (
    <div className=":uno: mt-12 min-h-screen w-full flex flex-col items-center">
      <div className="mx-auto max-w-xl w-full">
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
                {`${selectedMember.firstName} ${selectedMember.lastName}`}
              </p>
              <p>
                <strong>Assessment:</strong>
                {' '}
                {selectedMember.assessmentName}
              </p>
              <p>
                <strong>Address:</strong>
                {' '}
                {selectedMember.address}
              </p>
              <p>
                <strong>Phone:</strong>
                {' '}
                {selectedMember.phone || 'N/A'}
              </p>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <div>
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
              </div>
              <div>
                <Button onClick={handleContinue} disabled={isLoading || !hra}>
                  {isLoading ? 'Loading...' : 'Continue'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HRAStartView
