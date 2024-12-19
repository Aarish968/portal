import HRAQuestionContinueButton from './hra-question-continue-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import { Button } from '@/base_submod/components/ui/button'

interface HRASelectSingleQuestionProps {
  choices: string[]
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}

function HRASelectSingleQuestion({
  choices,
  answer,
  onAnswer,
  onNext,
}: HRASelectSingleQuestionProps) {
  if (choices.length > 6) {
    return (
      <div className=":uno: w-full flex flex-col space-y-6">
        <Select value={answer} onValueChange={onAnswer}>
          <SelectTrigger className=":uno: w-full">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent>
            {choices?.map((choice: string) => (
              <SelectItem key={choice} value={choice}>
                {choice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <HRAQuestionContinueButton disabled={!answer} onNext={onNext} />
      </div>
    )
  }

  return (
    <div className=":uno: w-full flex flex-col justify-center space-y-6">
      <div className=":uno: mx-auto flex flex-col space-y-2">
        {choices?.map((choice: string) => (
          <div key={choice}>
            <Button
              variant={answer === choice ? 'default' : 'outline'}
              onClick={() => onAnswer(choice)}
              className=":uno: normal-case"
            >
              {choice}
            </Button>
          </div>
        ))}
      </div>

      <HRAQuestionContinueButton disabled={!answer} onNext={onNext} />
    </div>
  )
}

export default HRASelectSingleQuestion
