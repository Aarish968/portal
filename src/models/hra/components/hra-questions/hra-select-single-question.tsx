import { HRACheckbox } from '../hra-checkbox'
import HRASelectedAnswerButton from './hra-selected-answer-button'
import HRAQuestionContinueButton from './hra-question-continue-button'
import { formatChoice, hasLongChoices } from '@/models/hra/utils/question-utils'

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
  if (hasLongChoices(choices) || choices.length > 6) {
    return (
      <div className=":uno: flex flex-col justify-start space-y-2">
        <div className=":uno: mx-auto max-w-[400px] w-full flex flex-col items-center space-y-4">
          {choices?.map((choice: string) => (
            <HRACheckbox
              key={choice}
              id={choice}
              label={formatChoice(choice)}
              checked={answer === choice}
              onCheckedChange={checked => checked && onAnswer(choice)}
            />
          ))}
        </div>
        <HRAQuestionContinueButton disabled={!answer} onNext={onNext} />
      </div>
    )
  }

  return (
    <>
      <div className=":uno: w-full flex flex-col items-center space-y-4">
        {choices?.map((choice: string) => (
          <div key={choice}>
            <HRASelectedAnswerButton
              isSelected={answer === choice}
              onClick={() => onAnswer(choice)}
            >
              {formatChoice(choice)}
            </HRASelectedAnswerButton>
          </div>
        ))}
      </div>
      <HRAQuestionContinueButton disabled={!answer} onNext={onNext} />
    </>
  )
}

export default HRASelectSingleQuestion
