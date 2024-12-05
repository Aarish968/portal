import { useEffect } from 'react'
import { Button } from '@/base_submod/components/ui/button'

interface HRAYesNoQuestionProps {
  answer: boolean | null
  onAnswer: (answer: boolean) => void
  onNext: () => void
}

function HRAYesNoQuestion({ answer, onAnswer, onNext }: HRAYesNoQuestionProps) {
  useEffect(() => {
    if (answer !== null) {
      const timer = setTimeout(onNext, 750)
      return () => clearTimeout(timer)
    }
  }, [answer, onNext])

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
            onClick={() => onAnswer(false)}
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
            onClick={() => onAnswer(true)}
          >
            Yes
          </Button>
        </div>
      </div>
      <button
        className="text-sm text-gray-500 hover:underline"
        onClick={() => onAnswer(false)}
      >
        Not Applicable
      </button>
    </div>
  )
}

export default HRAYesNoQuestion
