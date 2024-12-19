import { Icon } from '@iconify/react'
import { Button } from '@/base_submod/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/base_submod/components/ui/dropdown-menu'

interface HRAViewMenuProps {
  onEdit: () => void
  onStopAndSave: () => void
}

function HRAViewMenu({ onEdit, onStopAndSave }: HRAViewMenuProps) {
  return (
    <div className=":uno: absolute bottom-8 right-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className=":uno: h-9 w-9">
            <Icon icon="ph:dots-three-outline-fill" className=":uno: mb-.5 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="left" className=":uno: mb-22" sideOffset={4}>
          <DropdownMenuItem onClick={onEdit}>
            <Icon icon="ph:pencil" className=":uno: mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onStopAndSave}>
            <Icon icon="ph:door" className=":uno: mr-2 h-4 w-4" />
            Stop and Save
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default HRAViewMenu
