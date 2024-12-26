import { HRACheckbox } from '../hra-checkbox'
import HRASelectedAnswerButton from './hra-selected-answer-button'
import HRAQuestionContinueButton from './hra-question-continue-button'
import { formatChoice, hasLongChoices } from '@/models/hra/utils/question-utils'

interface HRAMultiSelectQuestionProps {
  choices: string[]
  answer: string[]
  onAnswer: (answer: string[]) => void
  onNext: () => void
}

function HRAMultiSelectQuestion({
  choices,
  answer = [],
  onAnswer,
  onNext,
}: HRAMultiSelectQuestionProps) {
  const toggleChoice = (choice: string) => {
    if (answer.includes(choice)) {
      onAnswer(answer.filter(item => item !== choice))
    }
    else {
      onAnswer([...answer, choice])
    }
  }

  if (hasLongChoices(choices) || choices.length > 6) {
    return (
      <div className=":uno: flex flex-col justify-start space-y-6">
        <div className=":uno: mx-auto max-w-[500px] w-full flex flex-col items-center space-y-4">
          {choices?.map((choice: string) => (
            <HRACheckbox
              key={choice}
              id={choice}
              label={formatChoice(choice)}
              checked={answer.includes(choice)}
              onCheckedChange={() => toggleChoice(choice)}
            />
          ))}
        </div>
        <HRAQuestionContinueButton disabled={answer.length === 0} onNext={onNext} />
      </div>
    )
  }

  return (
    <>
      <div className=":uno: w-full flex flex-col items-center space-y-4">
        {choices?.map((choice: string) => (
          <div key={choice}>
            <HRASelectedAnswerButton
              isSelected={answer.includes(choice)}
              onClick={() => toggleChoice(choice)}
            >
              {formatChoice(choice)}
            </HRASelectedAnswerButton>
          </div>
        ))}
      </div>
      <HRAQuestionContinueButton disabled={answer.length === 0} onNext={onNext} />
    </>
  )
}

export default HRAMultiSelectQuestion
