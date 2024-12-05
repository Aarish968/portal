import { Button } from '@/base_submod/components/ui/button'

interface HRATextQuestionProps {
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}

function HRATextQuestion({ answer, onAnswer, onNext }: HRATextQuestionProps) {
  return (
    <div className="w-full flex flex-col space-y-6">
      <input
        type="text"
        className="w-full border rounded p-2"
        onChange={e => onAnswer(e.target.value)}
        value={answer || ''}
        placeholder="Type your answer here..."
      />

      <div className="flex justify-center">
        <Button
          className="w-full rounded-full bg-[#4A3880] hover:bg-[#4A3880]/90"
          disabled={!answer?.trim()}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default HRATextQuestion
