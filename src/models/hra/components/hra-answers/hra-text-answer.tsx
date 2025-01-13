import { Input } from '@/base_submod/components/ui/input'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRATextAnswerProps {
  question: HRAQuestion
  answer: any
  onAnswerChange: (questionId: string, value: any) => void
}

export function HRATextAnswer({ question, answer, onAnswerChange }: HRATextAnswerProps) {
  return (
    <Input
      value={String(answer || '')}
      onChange={e => onAnswerChange(question.questionId, e.target.value)}
      className=":uno: w-[200px]"
      placeholder="Enter text..."
    />
  )
}
