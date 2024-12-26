import { Pencil } from 'lucide-react'
import { Button } from '@/base_submod/components/ui/button'

interface HRAReviewEditButtonProps {
  isEditing: boolean
  onClick: () => void
}

export function HRAReviewEditButton({ isEditing, onClick }: HRAReviewEditButtonProps) {
  return (
    <div>

      <div className=":uno: mb-4 flex justify-end">
        <Button
          variant={isEditing ? 'default' : 'outline'}
          onClick={onClick}
          className=":uno: gap-2"
        >
          <Pencil className=":uno: h-4 w-4" />
          {isEditing ? 'Editing...' : 'Edit Answers'}
        </Button>
      </div>
    </div>
  )
}
