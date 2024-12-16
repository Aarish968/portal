import HRAYesNoQuestion from './hra-yes-no-question'
import HRATextQuestion from './hra-text-question'
import HRAMultiSelectQuestion from './hra-multi-select-question'
import HRASelectSingleQuestion from './hra-select-single-question'
import HRAContainerQuestion from './hra-container-question'
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
  const containerAnswers = (!question.answerType && question.children)
    ? (typeof answer === 'object' && !Array.isArray(answer) ? answer : {})
    : {}

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {!question.answerType && question.children
          ? (
              <HRAContainerQuestion
                question={question}
                answers={containerAnswers}
                onAnswer={onAnswer}
                onNext={onNext}
              />
            )
          : (
              <div className="flex flex-col items-center justify-center gap-4">
                {question.parentQuestionText && (
                  <div className="w-full">
                    <h3 className="mb-2 text-xl font-medium">{question.parentQuestionText}</h3>
                    <div className="mb-6 border-l-4 border-primary/20 pl-4">
                      <h4 className="text-lg">{question.questionText}</h4>
                    </div>
                  </div>
                )}

                {!question.parentQuestionText && (
                  <h3 className="mb-4 text-xl font-medium">{question.questionText}</h3>
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
            )}
      </CardContent>
    </Card>
  )
}

export default HRAQuestionCard
