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
      <div className="w-full flex flex-col space-y-6">
        <div className="mx-auto flex flex-col space-y-4">
          {choices?.map((choice: string) => (
            <div key={choice} className="items-center space-x-2">
              <Checkbox
                id={choice}
                checked={answer.includes(choice)}
                onCheckedChange={() => toggleChoice(choice)}
              />
              <label
                htmlFor={choice}
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {choice}
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <div>
            <Button
              className="w-full rounded-full bg-[#4A3880] hover:bg-[#4A3880]/90"
              disabled={answer.length === 0}
              onClick={onNext}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col justify-center space-y-6">
      <div className="mx-auto flex flex-col space-y-2">
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

      <div className="flex justify-center">
        <div>
          <Button
            className="w-full rounded-full bg-[#4A3880] hover:bg-[#4A3880]/90"
            disabled={answer.length === 0}
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HRAMultiSelectQuestion
