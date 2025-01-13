import { HRACheckbox } from '@/models/hra/components/hra-checkbox'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRAMultipleSelectAnswerProps {
  question: HRAQuestion
  answer: any
  onAnswerChange: (questionId: string, value: any) => void
}

export function HRAMultipleSelectAnswer({ question, answer, onAnswerChange }: HRAMultipleSelectAnswerProps) {
  const selectedValues = Array.isArray(answer) ? answer : answer ? [answer] : []

  return (
    <div className=":uno: w-full flex flex-col space-y-2">
      {question.answerPicklistChoices?.map((choice: string) => (
        <HRACheckbox
          key={choice}
          id={`${question.questionId}-${choice}`}
          label={choice}
          checked={selectedValues.includes(choice)}
          onCheckedChange={() => {
            const newValues = selectedValues.includes(choice)
              ? selectedValues.filter(v => v !== choice)
              : [...selectedValues, choice]
            onAnswerChange(question.questionId, newValues)
          }}
        />
      ))}
    </div>
  )
}
