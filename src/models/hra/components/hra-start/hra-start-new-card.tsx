import type { Member } from '@/models/member/schemas/member-schema'
import { HraStartHeading } from './hra-start-heading'
import { HraStartMemberInfo } from './hra-start-member-info'

interface HraStartCardProps {
  member: Member
  isLoading: boolean
  onCancel: () => void
  onContinue: () => void
  hra: any
}

export function HraStartCard({ member, isLoading, onCancel, onContinue, hra }: HraStartCardProps) {
  return (
    <div className=":uno: mt-12 min-h-screen w-full flex flex-col items-center">
      <div className=":uno: mx-auto max-w-xl w-full">
        <HraStartHeading
          title="Let's get started"
          description="You are about to complete a HRA for the below member. Please make sure you have the correct member before proceeding."
        />

        <HraStartMemberInfo
          member={member}
          isLoading={isLoading}
          onCancel={onCancel}
          onContinue={onContinue}
          hra={hra}
          continueText="Start Assessment"
        />
      </div>
    </div>
  )
}
