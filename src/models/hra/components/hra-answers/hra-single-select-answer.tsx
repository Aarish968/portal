import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRASingleSelectAnswerProps {
  question: HRAQuestion
  answer: any
  onAnswerChange: (questionId: string, value: any) => void
}

export function HRASingleSelectAnswer({ question, answer, onAnswerChange }: HRASingleSelectAnswerProps) {
  return (
    <Select value={String(answer)} onValueChange={value => onAnswerChange(question.questionId, value)}>
      <SelectTrigger className=":uno: w-[200px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {question.answerPicklistChoices?.map((choice: string) => (
          <SelectItem key={choice} value={choice}>
            {choice}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
