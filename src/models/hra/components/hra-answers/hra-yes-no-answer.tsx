import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRAYesNoAnswerProps {
  question: HRAQuestion
  answer: any
  onAnswerChange: (questionId: string, value: any) => void
}

export function HRAYesNoAnswer({ question, answer, onAnswerChange }: HRAYesNoAnswerProps) {
  return (
    <Select
      value={String(answer)}
      onValueChange={value => onAnswerChange(question.questionId, value === 'true')}
    >
      <SelectTrigger className=":uno: w-[200px]">
        <SelectValue placeholder="Select Yes/No" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">Yes</SelectItem>
        <SelectItem value="false">No</SelectItem>
      </SelectContent>
    </Select>
  )
}
