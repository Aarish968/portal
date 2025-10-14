import { Icon } from '@iconify/react'
import { Button } from '@/base_submod/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/base_submod/components/ui/dropdown-menu'

interface FilterButtonsDropdownProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
  filterOptions: string[]
}

function FilterButtonsDropdown({ currentFilter, onFilterChange, filterOptions }: FilterButtonsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button variant="outline" size="sm" className=":uno: normal-case !font-hind">
            <Icon icon="ph:funnel" className=":uno: mr-2 h-4 w-4" />
            <div className=":uno: pt-.5">
              {currentFilter}
            </div>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {filterOptions.map(status => (
          <DropdownMenuItem
            key={status}
            onClick={() => onFilterChange(status)}
            className=":uno: cursor-pointer"
          >
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FilterButtonsDropdown
