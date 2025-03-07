import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/base_submod/components/ui/button'
import { Calendar } from '@/base_submod/components/ui/calendar'
import { Input } from '@/base_submod/components/ui/input'
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
  questionText?: string
}

function getYearRange() {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let i = currentYear + 1; i >= currentYear - 100; i--) {
    years.push(i)
  }
  return years
}

function HRADateSelect({ value, onChange, dateFormat, questionText }: HRADateSelectProps) {
  const isMonthYearFormat = dateFormat.includes('MM') && dateFormat.includes('YYYY') && !dateFormat.includes('DD')
  const isYearFormat = dateFormat === 'YYYY'
  const isBirthDate = questionText?.toLowerCase().includes('date of birth')

  if (isBirthDate) {
    const handleNumericInput = (value: string) => {
      const numericValue = value.replace(/\D/g, '')
      return numericValue
    }

    return (
      <div className=":uno: max-w-[300px] w-full">
        <div className=":uno: flex items-center justify-center gap-1">
          <Input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={2}
            placeholder="MM"
            className=":uno: w-8"
            value={value ? value.split('-')[0] : ''}
            onChange={(e) => {
              const month = handleNumericInput(e.target.value)
              if (!month) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[0] = ''
                onChange(existingParts.join('-'))
                return
              }
              const monthNum = Number.parseInt(month)
              if (monthNum > 12)
                return

              if (month.length === 2) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[0] = month.padStart(2, '0')
                onChange(existingParts.join('-'))
                ;(e.target.nextElementSibling?.nextElementSibling as HTMLInputElement)?.focus()
              }
              else if (month.length <= 2) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[0] = month
                onChange(existingParts.join('-'))
              }
            }}
          />
          <span className=":uno: text-md">/</span>
          <Input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={2}
            placeholder="DD"
            className=":uno: w-8"
            value={value ? value.split('-')[1] : ''}
            onChange={(e) => {
              const day = handleNumericInput(e.target.value)
              if (!day) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[1] = ''
                onChange(existingParts.join('-'))
                return
              }
              const dayNum = Number.parseInt(day)
              if (dayNum > 31)
                return

              if (day.length === 2) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[1] = day.padStart(2, '0')
                onChange(existingParts.join('-'))
                ;(e.target.nextElementSibling?.nextElementSibling as HTMLInputElement)?.focus()
              }
              else if (day.length <= 2) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[1] = day
                onChange(existingParts.join('-'))
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !e.currentTarget.value) {
                ;(e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement)?.focus()
              }
            }}
          />
          <span className=":uno: text-md">/</span>
          <Input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={4}
            placeholder="YYYY"
            className=":uno: w-24"
            value={value ? value.split('-')[2] : ''}
            onChange={(e) => {
              const year = handleNumericInput(e.target.value)
              if (!year) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[2] = ''
                onChange(existingParts.join('-'))
                return
              }

              if (year.length <= 4) {
                const existingParts = value ? value.split('-') : ['', '', '']
                existingParts[2] = year

                if (year.length === 4) {
                  const yearNum = Number.parseInt(year)
                  const currentYear = new Date().getFullYear()
                  if (isBirthDate && yearNum > currentYear) {
                    return
                  }
                }

                onChange(existingParts.join('-'))
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !e.currentTarget.value) {
                const parts = value ? value.split('-') : ['', '', '']
                if (parts[1]) {
                  parts[1] = ''
                  onChange(parts.join('-'))
                  ;(e.currentTarget.previousElementSibling?.previousElementSibling as HTMLInputElement)?.focus()
                }
                else if (parts[0]) {
                  parts[0] = ''
                  onChange(parts.join('-'))
                  ;(e.currentTarget.previousElementSibling?.previousElementSibling?.previousElementSibling?.previousElementSibling as HTMLInputElement)?.focus()
                }
              }
            }}
          />
        </div>
      </div>
    )
  }

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
