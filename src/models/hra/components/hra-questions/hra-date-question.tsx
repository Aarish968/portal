import HRADateSelect from '../hra-date-select'
import HRAQuestionContinueButton from './hra-question-continue-button'

interface HRADateQuestionProps {
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}

function HRADateQuestion({ answer, onAnswer, onNext }: HRADateQuestionProps) {
  return (
    <div className=":uno: w-full flex flex-col items-center space-y-6">
      <HRADateSelect value={answer} onChange={onAnswer} />
      <HRAQuestionContinueButton
        disabled={!answer}
        onNext={onNext}
      />
    </div>
  )
}

export default HRADateQuestion
