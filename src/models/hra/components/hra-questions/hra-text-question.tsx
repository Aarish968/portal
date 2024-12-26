import HRAQuestionContinueButton from './hra-question-continue-button'

interface HRATextQuestionProps {
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
}

function HRATextQuestion({ answer, onAnswer, onNext }: HRATextQuestionProps) {
  return (
    <>
      <input
        type="text"
        className=":uno: w-full border rounded p-2"
        onChange={e => onAnswer(e.target.value)}
        value={answer || ''}
        placeholder="Type your answer here..."
      />
      <HRAQuestionContinueButton disabled={!answer?.trim()} onNext={onNext} />
    </>
  )
}

export default HRATextQuestion
