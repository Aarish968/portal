import { useState } from 'react'
import { Button } from '@/base_submod/components/ui/button'

const FILTER_TYPES = {
  All: 'All',
  Upcoming: 'Upcoming',
  InProgress: 'In Progress',
  Completed: 'Completed',
} as const

type FilterOption = typeof FILTER_TYPES[keyof typeof FILTER_TYPES]

interface HraActivityFilterProps {
  onFilterChange: (filter: FilterOption) => void
}

export function HraActivityFilter({ onFilterChange }: HraActivityFilterProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>(FILTER_TYPES.Upcoming)

  const handleFilterClick = (filter: FilterOption) => {
    setActiveFilter(filter)
    onFilterChange(filter)
  }

  return (
    <div className=":uno: flex items-center">
      <span className=":uno: mr-2 font-medium">Show:</span>
      {Object.values(FILTER_TYPES).map((option, index) => (
        <div key={option} className=":uno: flex items-center">
          {index > 0 && <div className=":uno: mx-1 h-4 w-px bg-gray-300" />}
          <Button
            variant={activeFilter === option ? 'filterActive' : 'filter'}
            size="sm"
            onClick={() => handleFilterClick(option)}
          >
            {option}
          </Button>
        </div>
      ))}
    </div>
  )
}
