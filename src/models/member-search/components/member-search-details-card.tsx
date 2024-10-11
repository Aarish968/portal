import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import type { Member } from '@/models/member/schemas/member-schema'
import MemberSearchDetailsCardItem from '@/models/member-search/components/member-search-details-card-item'
import MemberSearchDetailsCardShadedRow from '@/models/member-search/components/member-search-details-card-shaded-row'

interface MemberSearchDetailsCardProps {
  member: Member
}

function MemberSearchDetailsCard({ member }: MemberSearchDetailsCardProps) {
  const navigate = useNavigate()

  const handleStartHRA = () => {
    navigate('/hra')
  }

  const onCancel = () => {
    navigate('/')
  }

  return (
    <Card>
      <CardContent>
        <div className=":uno: flex items-center justify-between pt-6">
          <h2 className=":uno: flex items-center text-2xl font-semibold">
            <span className=":uno: mr-2">👤</span>
            {' '}
            Member Details
          </h2>
          <span className=":uno: text-sm text-gray-500">
            Last updated:
            {new Date().toLocaleString()}
          </span>
        </div>

        <div className=":uno: grid grid-cols-2 gap-4">
          <MemberSearchDetailsCardItem label="Name" value={`${member.firstName} ${member.lastName}`} />
          <MemberSearchDetailsCardItem label="Date of Birth" value={member.dateOfBirth} />
        </div>

        <MemberSearchDetailsCardShadedRow>
          <MemberSearchDetailsCardItem label="Health Plan" value={member.healthPlan} />
          <MemberSearchDetailsCardItem label="Member ID" value={member.id} />
        </MemberSearchDetailsCardShadedRow>

        <MemberSearchDetailsCardItem label="Address" value={member.address} />

        <MemberSearchDetailsCardShadedRow>
          <MemberSearchDetailsCardItem label="Phone" value={member.phone} />
        </MemberSearchDetailsCardShadedRow>

        <MemberSearchDetailsCardItem label="Email" value={member.email} />

        <MemberSearchDetailsCardShadedRow>
          <MemberSearchDetailsCardItem
            label="HRA Status"
            value={(
              <span className=":uno: rounded-full bg-yellow-100 px-2 text-sm text-yellow-800">
                {member.hrsStatus}
              </span>
            )}
          />
        </MemberSearchDetailsCardShadedRow>

        <MemberSearchDetailsCardItem label="Notes" value={member.notes} className=":uno: border-b" />

        <div className=":uno: mt-6 flex justify-end space-x-4">
          <div>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
          <div>
            <Button className=":uno: bg-orange-500 hover:bg-orange-600" onClick={handleStartHRA}>Start HRA</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MemberSearchDetailsCard
