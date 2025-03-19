import type { Member } from '@/models/member/schemas/member-schema'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'

interface HraStartMemberInfoProps {
  member: Member
  isLoading: boolean
  onCancel: () => void
  onContinue: () => void
  hra: any
  continueText: string
  cancelText?: string
}

export function HraStartMemberInfo({
  member,
  isLoading,
  onCancel,
  onContinue,
  hra,
  continueText,
  cancelText = 'Cancel',
}: HraStartMemberInfoProps) {
  return (
    <Card className=":uno: mb-6">
      <CardContent className=":uno: p-6">
        <div className=":uno: space-y-2">
          <p>
            <strong>Name:</strong>
            {' '}
            {`${member.firstName} ${member.lastName}`}
          </p>
          <p>
            <strong>Address:</strong>
            {' '}
            {member.address}
          </p>
          <p>
            <strong>Phone:</strong>
            {' '}
            {member.phone || 'N/A'}
          </p>
        </div>

        <div className=":uno: mt-8 flex justify-center space-x-4">
          <div>
            <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
          </div>
          <div>
            <Button onClick={onContinue} disabled={isLoading || !hra}>
              {isLoading ? 'Loading...' : continueText}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
