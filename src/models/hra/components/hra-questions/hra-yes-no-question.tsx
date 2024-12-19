import HRAQuestionContinueButton from './hra-question-continue-button'
import { Button } from '@/base_submod/components/ui/button'

interface HRAYesNoQuestionProps {
  answer: boolean | null
  onAnswer: (answer: boolean) => void
  onNext: () => void
}

function HRAYesNoQuestion({ answer, onAnswer, onNext }: HRAYesNoQuestionProps) {
  const handleAnswer = (value: boolean) => {
    if (value !== answer) {
      onAnswer(value)
    }
  }

  return (
    <div className=":uno: w-full flex flex-col items-center space-y-6">
      <div className=":uno: flex justify-center space-x-4">
        <div>
          <Button
            variant="outline"
            className={`${
              answer === false
                ? 'bg-[#FF9B5B] hover:bg-[#FF9B5B] text-white border-[#FF9B5B] normal-case'
                : 'hover:bg-[#FF9B5B/10] hover:text-[#FF9B5B] hover:border-[#FF9B5B] normal-case'
            }`}
            onClick={() => handleAnswer(false)}
          >
            No
          </Button>
        </div>
        <div>
          <Button
            variant="outline"
            className={`${
              answer === true
                ? 'bg-[#4A3880] hover:bg-[#4A3880] text-white border-[#4A3880] normal-case'
                : 'hover:bg-[#4A3880/10] hover:text-[#4A3880] hover:border-[#4A3880] normal-case'
            }`}
            onClick={() => handleAnswer(true)}
          >
            Yes
          </Button>
        </div>
      </div>

      <HRAQuestionContinueButton disabled={answer === null} onNext={onNext} />
    </div>
  )
}

export default HRAYesNoQuestion
