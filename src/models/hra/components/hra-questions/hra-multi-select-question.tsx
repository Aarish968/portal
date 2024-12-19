import HRAQuestionContinueButton from './hra-question-continue-button'
import { Button } from '@/base_submod/components/ui/button'
import { Checkbox } from '@/base_submod/components/ui/checkbox'

interface HRAMultiSelectQuestionProps {
  choices: string[]
  answer: string[]
  onAnswer: (answer: string[]) => void
  onNext: () => void
}

function HRAMultiSelectQuestion({
  choices,
  answer = [],
  onAnswer,
  onNext,
}: HRAMultiSelectQuestionProps) {
  const toggleChoice = (choice: string) => {
    if (answer.includes(choice)) {
      onAnswer(answer.filter(item => item !== choice))
    }
    else {
      onAnswer([...answer, choice])
    }
  }

  if (choices.length > 6) {
    return (
      <div className=":uno: w-full flex flex-col space-y-6">
        <div className=":uno: mx-auto flex flex-col space-y-2">
          {choices?.map((choice: string) => (
            <div key={choice} className=":uno: items-center space-x-2">
              <Checkbox
                id={choice}
                checked={answer.includes(choice)}
                onCheckedChange={() => toggleChoice(choice)}
              />
              <label
                htmlFor={choice}
                className=":uno: text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {choice}
              </label>
            </div>
          ))}
        </div>

        <HRAQuestionContinueButton disabled={answer.length === 0} onNext={onNext} />
      </div>
    )
  }

  return (
    <div className=":uno: w-full flex flex-col justify-center space-y-6">
      <div className=":uno: mx-auto flex flex-col space-y-2">
        {choices?.map((choice: string) => (
          <div key={choice}>
            <Button
              variant={answer.includes(choice) ? 'default' : 'outline'}
              onClick={() => toggleChoice(choice)}
            >
              {choice}
            </Button>
          </div>
        ))}
      </div>

      <HRAQuestionContinueButton disabled={answer.length === 0} onNext={onNext} />
    </div>
  )
}

export default HRAMultiSelectQuestion
