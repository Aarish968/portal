import HRAYesNoQuestion from './hra-yes-no-question'
import HRATextQuestion from './hra-text-question'
import HRAMultiSelectQuestion from './hra-multi-select-question'
import HRASelectSingleQuestion from './hra-select-single-question'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { Card, CardContent } from '@/base_submod/components/ui/card'

interface HRAQuestionCardProps {
  question: HRAQuestion
  answer: string | boolean | string[] | Record<string, string | boolean | string[]>
  onAnswer: (questionId: string, answer: string | boolean | string[]) => void
  onNext: () => void
}

function HRAQuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
}: HRAQuestionCardProps) {
  return (
    <Card className=":uno: w-full">
      <CardContent className=":uno: p-6">
        <div className=":uno: flex flex-col items-center justify-center gap-4">
          {question.parentQuestionText && (
            <div className=":uno: w-full text-center">
              <h3 className=":uno: mb-2 text-xl font-medium">{question.parentQuestionText}</h3>
              <div className=":uno: mb-6">
                <h4 className=":uno: text-lg">{question.questionText}</h4>
              </div>
            </div>
          )}

          {!question.parentQuestionText && (
            <h3 className=":uno: mb-4 text-center text-xl font-medium">{question.questionText}</h3>
          )}

          {question.answerType === 'Select Single' && (
            <HRASelectSingleQuestion
              choices={question.answerPicklistChoices || []}
              answer={answer as string}
              onAnswer={answer => onAnswer(question.questionId, answer)}
              onNext={onNext}
            />
          )}

          {question.answerType === 'Select Multiple' && (
            <HRAMultiSelectQuestion
              choices={question.answerPicklistChoices || []}
              answer={answer as string[]}
              onAnswer={answer => onAnswer(question.questionId, answer)}
              onNext={onNext}
            />
          )}

          {question.answerType === 'Yes/No' && (
            <HRAYesNoQuestion
              answer={answer === undefined ? null : answer as boolean}
              onAnswer={answer => onAnswer(question.questionId, answer)}
              onNext={onNext}
            />
          )}

          {question.answerType === 'Text' && (
            <HRATextQuestion
              answer={answer as string}
              onAnswer={answer => onAnswer(question.questionId, answer)}
              onNext={onNext}
            />
          )}
        </div>

      </CardContent>
    </Card>
  )
}

export default HRAQuestionCard
