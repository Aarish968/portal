import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import { Button } from '@/base_submod/components/ui/button'
import { useHRAStore } from '@/models/hra/stores/hra-store'

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
  const { nextQuestion } = useHRAStore()

  const handleContinue = () => {
    nextQuestion()
    onNext()
  }

  if (choices.length > 6) {
    return (
      <div className="w-full flex flex-col space-y-6">
        <Select value={answer} onValueChange={onAnswer}>
          <SelectTrigger className="w-full">
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

        <div className="flex justify-center">
          <Button
            className="w-full rounded-full bg-[#4A3880] hover:bg-[#4A3880]/90"
            disabled={!answer}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col justify-center space-y-6">
      <div className="mx-auto flex flex-col space-y-2">
        {choices?.map((choice: string) => (
          <div className="">
            <Button
              key={choice}
              variant={answer === choice ? 'default' : 'outline'}
              className="w-full items-center justify-center"
              onClick={() => onAnswer(choice)}
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
            disabled={!answer}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HRASelectSingleQuestion
