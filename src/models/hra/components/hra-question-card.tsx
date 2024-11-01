import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRAQuestionCardProps {
  question: HRAQuestion
  questionNumber: number
  totalQuestions: number
  answer: string | boolean
  onAnswer: (questionId: string, answer: string | boolean) => void
}

function HRAQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswer,
}: HRAQuestionCardProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <p className="mb-6 text-sm text-gray-500">
          Question
          {' '}
          {questionNumber}
          {' '}
          of
          {' '}
          {totalQuestions}
        </p>
        <div className=":uno: flex flex-col items-center justify-center gap-4">
          <h3 className="mb-4 text-xl font-medium">{question.questionText}</h3>

          {question.answerType === 'Select Single' && (
            <div className="space-y-2">
              {question.answerPicklistChoices?.map((choice: string) => (
                <Button
                  key={choice}
                  variant={answer === choice ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => onAnswer(question.questionId, choice)}
                >
                  {choice}
                </Button>
              ))}
            </div>
          )}

          {question.answerType === 'Yes/No' && (
            <div className="flex space-x-4">
              <Button
                variant={answer === true ? 'default' : 'outline'}
                onClick={() => onAnswer(question.questionId, true)}
              >
                Yes
              </Button>
              <Button
                variant={answer === false ? 'default' : 'outline'}
                onClick={() => onAnswer(question.questionId, false)}
              >
                No
              </Button>
            </div>
          )}

          {!question.answerType && (
            <input
              type="text"
              className="w-full border rounded p-2"
              onChange={e => onAnswer(question.questionId, e.target.value)}
              value={answer as string || ''}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default HRAQuestionCard
