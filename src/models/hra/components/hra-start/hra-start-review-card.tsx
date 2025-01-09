import type { Member } from '@/models/member/schemas/member-schema'
import { HraStartHeading } from './hra-start-heading'
import { HraStartMemberInfo } from './hra-start-member-info'

interface HraReviewCardProps {
  member: Member
  isLoading: boolean
  onCancel: () => void
  onContinue: () => void
  hra: any
}

export function HraReviewCard({ member, isLoading, onCancel, onContinue, hra }: HraReviewCardProps) {
  return (
    <div className=":uno: mt-12 min-h-screen w-full flex flex-col items-center">
      <div className=":uno: mx-auto max-w-xl w-full">
        <HraStartHeading
          title="Review Assessment"
          description="This assessment has been completed. You can review the responses below."
        />

        <HraStartMemberInfo
          member={member}
          isLoading={isLoading}
          onCancel={onCancel}
          onContinue={onContinue}
          hra={hra}
          continueText="Review Assessment"
          cancelText="Back"
        />
      </div>
    </div>
  )
}
