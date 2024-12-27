import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/base_submod/components/ui/button'
import { Calendar } from '@/base_submod/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/base_submod/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import { MONTHS } from '@/models/hra/utils/date-utils'

interface HRADateSelectProps {
  value: string
  onChange: (value: string) => void
  dateFormat: string
}

function getYearRange() {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear + 1; i >= currentYear - 100; i--) {
    years.push(i)
  }
  return years
}

function HRADateSelect({ value, onChange, dateFormat }: HRADateSelectProps) {
  const isMonthYearFormat = dateFormat.includes('MM') && dateFormat.includes('YYYY') && !dateFormat.includes('DD')
  const isYearFormat = dateFormat === 'YYYY'

  let selectedMonth: string | undefined
  let selectedYear: string | undefined

  if (isMonthYearFormat && value) {
    const [month, year] = value.split('-')
    const monthIndex = Number.parseInt(month) - 1
    selectedMonth = MONTHS[monthIndex]
    selectedYear = year
  }
  else if (isYearFormat) {
    selectedYear = value
  }
  else {
    const date = value ? new Date(value) : undefined
    selectedMonth = date ? format(date, 'MMMM') : undefined
    selectedYear = date ? format(date, 'yyyy') : undefined
  }

  const handleMonthSelect = (month: string) => {
    if (isMonthYearFormat) {
      const monthIndex = MONTHS.indexOf(month) + 1
      const monthStr = monthIndex.toString().padStart(2, '0')
      onChange(`${monthStr}-${selectedYear || new Date().getFullYear()}`)
      return
    }

    const currentDate = value ? new Date(value) : new Date()
    const monthIndex = MONTHS.indexOf(month)
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1)
    onChange(format(newDate, 'yyyy-MM-dd'))
  }

  const handleYearSelect = (year: string) => {
    if (isYearFormat) {
      onChange(year)
      return
    }

    if (isMonthYearFormat) {
      const monthIndex = selectedMonth ? MONTHS.indexOf(selectedMonth) + 1 : 1
      const monthStr = monthIndex.toString().padStart(2, '0')
      onChange(`${monthStr}-${year}`)
      return
    }

    const currentDate = value ? new Date(value) : new Date()
    const newDate = new Date(Number.parseInt(year), currentDate.getMonth(), 1)
    onChange(format(newDate, 'yyyy-MM-dd'))
  }

  if (isMonthYearFormat) {
    return (
      <div className=":uno: max-w-400px w-full flex gap-2">
        <Select value={selectedMonth} onValueChange={handleMonthSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map(month => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={handleYearSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {getYearRange().map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  if (isYearFormat) {
    return (
      <Select value={selectedYear} onValueChange={handleYearSelect}>
        <SelectTrigger>
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {getYearRange().map(year => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className=":uno: w-[280px] items-center justify-center text-center normal-case font-normal"
        >
          <CalendarIcon className="mb-1 mr-2 h-4 w-4" />
          {value ? format(new Date(value), 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=":uno: w-auto flex justify-center p-0" align="center">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={date => date && onChange(date.toISOString())}
          initialFocus
          className=":uno: w-[320px]"
        />
      </PopoverContent>
    </Popover>
  )
}

export default HRADateSelect
