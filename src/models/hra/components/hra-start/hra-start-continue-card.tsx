import type { Member } from '@/models/member/schemas/member-schema'
import { HraStartHeading } from './hra-start-heading'
import { HraStartMemberInfo } from './hra-start-member-info'

interface HraContinueCardProps {
  member: Member
  isLoading: boolean
  onCancel: () => void
  onContinue: () => void
  hra: any
}

export function HraContinueCard({ member, isLoading, onCancel, onContinue, hra }: HraContinueCardProps) {
  return (
    <div className=":uno: mt-12 min-h-screen w-full flex flex-col items-center">
      <div className=":uno: mx-auto max-w-xl w-full">
        <HraStartHeading
          title="Continue Assessment"
          description="You have a partially completed assessment for this member. You can continue where you left off."
        />

        <HraStartMemberInfo
          member={member}
          isLoading={isLoading}
          onCancel={onCancel}
          onContinue={onContinue}
          hra={hra}
          continueText="Continue Assessment"
        />
      </div>
    </div>
  )
}
