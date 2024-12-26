import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/base_submod/components/ui/button'
import { Calendar } from '@/base_submod/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/base_submod/components/ui/popover'

interface HRADateSelectProps {
  value: string
  onChange: (value: string) => void
}

function HRADateSelect({ value, onChange }: HRADateSelectProps) {
  const date = value ? new Date(value) : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className=":uno: w-[280px] items-center justify-center text-center normal-case font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=":uno: w-auto flex justify-center p-0" align="center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={date => onChange(date?.toISOString() || '')}
          initialFocus
          className=":uno: w-[320px]"
        />
      </PopoverContent>
    </Popover>
  )
}

export default HRADateSelect
