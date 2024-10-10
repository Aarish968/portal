import type { Member } from '../schemas/member-search-schema'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'

interface MemberSearchDetailsCardProps {
  member: Member
  onStartHRS: () => void
  onCancel: () => void
}

function MemberSearchDetailsCard({ member, onStartHRS, onCancel }: MemberSearchDetailsCardProps) {
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
            <p>CareFirst (DSNP)</p>
          </div>
          <div>
            <p className=":uno: font-semibold">Member ID:</p>
            <p>{member.id}</p>
          </div>
        </div>

        <div>
          <p className=":uno: font-semibold">Address:</p>
          <p>1234 W Candy Land Lane, Boise, ID 83702</p>
        </div>

        <div>
          <p className=":uno: font-semibold">Phone:</p>
          <p>1-555-555-5555</p>
        </div>

        <div>
          <p className=":uno: font-semibold">Email:</p>
          <p>samples@gmail.com</p>
        </div>

        <div>
          <p className=":uno: font-semibold">HRS Status:</p>
          <span className=":uno: rounded-full bg-yellow-100 px-2 py-1 text-sm text-yellow-800">Not Started</span>
        </div>

        <div>
          <p className=":uno: font-semibold">Notes:</p>
          <p>Member struggles with memory loss. Please be patient.</p>
        </div>

        <div className=":uno: mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button className=":uno: bg-orange-500 hover:bg-orange-600" onClick={onStartHRS}>Start HRS</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default MemberSearchDetailsCard
