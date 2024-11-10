import { Button } from '@/base_submod/components/ui/button'

interface HRAYesNoQuestionProps {
  answer: boolean | null
  onAnswer: (answer: boolean) => void
}

function HRAYesNoQuestion({ answer, onAnswer }: HRAYesNoQuestionProps) {
  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          className={`w-32 rounded-full ${
            answer === false
              ? 'bg-[#FF9B5B] hover:bg-[#FF9B5B] text-white border-[#FF9B5B]'
              : 'hover:bg-[#FF9B5B/10] hover:text-[#FF9B5B] hover:border-[#FF9B5B]'
          }`}
          onClick={() => onAnswer(false)}
        >
          No
        </Button>
        <Button
          variant="outline"
          className={`w-32 rounded-full ${
            answer === true
              ? 'bg-[#4A3880] hover:bg-[#4A3880] text-white border-[#4A3880]'
              : 'hover:bg-[#4A3880/10] hover:text-[#4A3880] hover:border-[#4A3880]'
          }`}
          onClick={() => onAnswer(true)}
        >
          Yes
        </Button>
      </div>
      <button
        className="text-sm text-gray-500 hover:underline"
        onClick={() => onAnswer(false)}
      >
        No Applicable
      </button>
    </div>
  )
}

export default HRAYesNoQuestion
