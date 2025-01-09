import { useEffect, useRef } from 'react'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import { useMemberStore } from '@/models/member/stores/member-store'
import { HraStartCard } from '../components/hra-start/hra-start-new-card'
import { HraContinueCard } from '../components/hra-start/hra-start-continue-card'
import { HraReviewCard } from '../components/hra-start/hra-start-review-card'
import { Button } from '@/base_submod/components/ui/button'

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
      <div className=":uno: text-center">
        <p className=":uno: text-red-500">
          Error loading HRA:
          {error}
        </p>
        <Button onClick={onCancel}>Back to HRA Activity</Button>
      </div>
    )
  }

  if (selectedMember.isCompleted) {
    return (
      <HraReviewCard
        member={selectedMember}
        isLoading={isLoading}
        onCancel={onCancel}
        onContinue={handleContinue}
        hra={hra}
      />
    )
  }

  if (selectedMember.isStarted) {
    return (
      <HraContinueCard
        member={selectedMember}
        isLoading={isLoading}
        onCancel={onCancel}
        onContinue={handleContinue}
        hra={hra}
      />
    )
  }

  return (
    <HraStartCard
      member={selectedMember}
      isLoading={isLoading}
      onCancel={onCancel}
      onContinue={handleContinue}
      hra={hra}
    />
  )
}

export default HRAStartView
