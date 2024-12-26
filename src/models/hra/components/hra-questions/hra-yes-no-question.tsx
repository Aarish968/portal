import HRASelectedAnswerButton from './hra-selected-answer-button'
import HRAQuestionContinueButton from './hra-question-continue-button'

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
    <div className=":uno: w-full flex flex-col items-center space-y-4">
      <div>
        <HRASelectedAnswerButton
          isSelected={answer === false}
          onClick={() => handleAnswer(false)}
        >
          No
        </HRASelectedAnswerButton>
      </div>
      <div>
        <HRASelectedAnswerButton
          isSelected={answer === true}
          onClick={() => handleAnswer(true)}
        >
          Yes
        </HRASelectedAnswerButton>
      </div>
      <HRAQuestionContinueButton disabled={answer === null} onNext={onNext} />
    </div>
  )
}

export default HRAYesNoQuestion
