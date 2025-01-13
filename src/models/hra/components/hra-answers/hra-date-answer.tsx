import HRADateSelect from '@/models/hra/components/hra-date-select'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRADateAnswerProps {
  question: HRAQuestion
  answer: any
  onAnswerChange: (questionId: string, value: any) => void
}

export function HRADateAnswer({ question, answer, onAnswerChange }: HRADateAnswerProps) {
  return (
    <div className=":uno: flex justify-center">
      <HRADateSelect
        value={answer || ''}
        onChange={value => onAnswerChange(question.questionId, value)}
        dateFormat={question.dateFormat || 'YYYY-MM-DD'}
      />
    </div>
  )
}
