import { Button } from '@/base_submod/components/ui/button'

interface HRAYesNoQuestionProps {
  answer: boolean | null
  onAnswer: (answer: boolean) => void
  onNext: () => void
}

function HRAYesNoQuestion({ answer, onAnswer, onNext }: HRAYesNoQuestionProps) {
  const handleAnswer = (value: boolean) => {
    if (value !== answer)
      onAnswer(value)
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="flex justify-center space-x-4">
        <div>
          <Button
            variant="outline"
            className={`${
              answer === false
                ? 'bg-[#FF9B5B] hover:bg-[#FF9B5B] text-white border-[#FF9B5B]'
                : 'hover:bg-[#FF9B5B/10] hover:text-[#FF9B5B] hover:border-[#FF9B5B]'
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
                ? 'bg-[#4A3880] hover:bg-[#4A3880] text-white border-[#4A3880]'
                : 'hover:bg-[#4A3880/10] hover:text-[#4A3880] hover:border-[#4A3880]'
            }`}
            onClick={() => handleAnswer(true)}
          >
            Yes
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <div>
          <Button
            className="w-full rounded-full bg-[#4A3880] hover:bg-[#4A3880]/90"
            disabled={answer === null}
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HRAYesNoQuestion
