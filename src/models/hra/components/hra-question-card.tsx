import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRAQuestionCardProps {
  question: HRAQuestion
  questionNumber: number
  totalQuestions: number
  answer: any
  onAnswer: (questionId: string, answer: any) => void
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
          <h3 className="mb-4 text-xl font-medium">{question.text}</h3>

          {question.type === 'multipleChoice' && (
            <div className="space-y-2">
              {question.options?.map(option => (
                <Button
                  key={option}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onAnswer(question.id, option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {question.type === 'boolean' && (
            <div className="flex space-x-4">
              <Button onClick={() => onAnswer(question.id, true)}>Yes</Button>
              <Button onClick={() => onAnswer(question.id, false)}>No</Button>
            </div>
          )}

          {question.type === 'text' && (
            <input
              type="text"
              className="w-full border rounded p-2"
              onChange={e => onAnswer(question.id, e.target.value)}
              value={answer as string || ''}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default HRAQuestionCard
