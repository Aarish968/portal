import HRADateSelect from '../hra-date-select'
import HRAQuestionContinueButton from './hra-question-continue-button'
import { isValidDateInput } from '@/models/hra/utils/question-utils'

interface HRADateQuestionProps {
  answer: string
  onAnswer: (answer: string) => void
  onNext: () => void
  dateFormat: string
  questionText: string
}

function HRADateQuestion({ answer, onAnswer, onNext, dateFormat, questionText }: HRADateQuestionProps) {
  return (
    <div className=":uno: w-full flex flex-col items-center space-y-6">
      <HRADateSelect
        value={answer}
        onChange={onAnswer}
        dateFormat={dateFormat}
        questionText={questionText}
      />
      <HRAQuestionContinueButton
        disabled={!isValidDateInput(answer, { questionText, dateFormat })}
        onNext={onNext}
      />
    </div>
  )
}

export default HRADateQuestion
