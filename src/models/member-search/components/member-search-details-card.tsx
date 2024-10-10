import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import type { Member } from '@/models/member/schemas/member-schema'
import { useHRAStore } from '@/models/hra/stores/hra-store'

interface MemberSearchDetailsCardProps {
  member: Member
  onCancel: () => void
}

function MemberSearchDetailsCard({ member, onCancel }: MemberSearchDetailsCardProps) {
  const navigate = useNavigate()
  const initializeHRA = useHRAStore(state => state.initializeHRA)

  const handleStartHRS = () => {
    initializeHRA()
    navigate('/hra')
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
          <div>
            <p className=":uno: font-semibold">Name:</p>
            <p>
              {member.firstName}
              {' '}
              {member.lastName}
            </p>
          </div>
          <div>
            <p className=":uno: font-semibold">Date of Birth:</p>
            <p>{member.dateOfBirth}</p>
          </div>
          <div>
            <p className=":uno: font-semibold">Health Plan:</p>
            <p>{member.healthPlan}</p>
          </div>
          <div>
            <p className=":uno: font-semibold">Member ID:</p>
            <p>{member.id}</p>
          </div>
        </div>

        <div>
          <p className=":uno: font-semibold">Address:</p>
          <p>{member.address}</p>
        </div>

        <div>
          <p className=":uno: font-semibold">Phone:</p>
          <p>{member.phone}</p>
        </div>

        <div>
          <p className=":uno: font-semibold">Email:</p>
          <p>{member.email}</p>
        </div>

        <div>
          <p className=":uno: font-semibold">HRS Status:</p>
          <span className=":uno: rounded-full bg-yellow-100 px-2 py-1 text-sm text-yellow-800">{member.hrsStatus}</span>
        </div>

        <div>
          <p className=":uno: font-semibold">Notes:</p>
          <p>{member.notes}</p>
        </div>

        <div className=":uno: mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className=":uno: bg-orange-500 hover:bg-orange-600" onClick={handleStartHRS}>Start HRS</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default MemberSearchDetailsCard
