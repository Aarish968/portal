import { motion } from 'motion/react'
import HRAYesNoQuestion from './hra-yes-no-question'
import HRATextQuestion from './hra-text-question'
import HRAMultiSelectQuestion from './hra-multi-select-question'
import HRASelectSingleQuestion from './hra-select-single-question'
import HRADateQuestion from './hra-date-question'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import HRAQuestionCardQuestionText from './hra-question-card-question-text'
import { isDateQuestion } from '@/models/hra/utils/question-utils'

interface HRAQuestionCardProps {
  question: HRAQuestion
  answer: string | boolean | string[] | Record<string, string | boolean | string[]>
  onAnswer: (questionId: string, answer: string | boolean | string[]) => void
  onNext: () => void
  direction: number
}

function HRAQuestionCard({
  question,
  answer,
  onAnswer,
  onNext,
  direction,
}: HRAQuestionCardProps) {
  const xOffset = 100

  return (
    <motion.div
      initial={{ opacity: 0, x: direction > 0 ? xOffset : -xOffset }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction > 0 ? -xOffset : xOffset }}
      transition={{
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut',
      }}
      key={question.questionId}
      className=":uno: w-full"
    >
      <Card className=":uno: w-full">
        <CardContent className=":uno: p-6">
          <div className=":uno: flex flex-col items-center justify-center gap-4">
            <HRAQuestionCardQuestionText
              parentQuestionText={question.parentQuestionText}
              questionText={question.questionText}
            />

            <div className=":uno: w-full flex flex-col space-y-6">
              <div className=":uno: mx-auto w-full flex flex-col items-center justify-center space-y-2">
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

                {question.answerType === 'Text' && !isDateQuestion(question.questionText) && (
                  <HRATextQuestion
                    answer={answer as string}
                    onAnswer={answer => onAnswer(question.questionId, answer)}
                    onNext={onNext}
                  />
                )}

                {question.answerType === 'Text' && isDateQuestion(question.questionText) && (
                  <HRADateQuestion
                    answer={answer as string}
                    onAnswer={answer => onAnswer(question.questionId, answer)}
                    onNext={onNext}
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default HRAQuestionCard
