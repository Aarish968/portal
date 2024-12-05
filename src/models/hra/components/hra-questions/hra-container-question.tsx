import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/base_submod/components/ui/button'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRAContainerQuestionProps {
  question: HRAQuestion
  answers: Record<string, string | boolean | string[]>
  onAnswer: (questionId: string, answer: string | boolean | string[]) => void
  onNext: () => void
}

function HRAContainerQuestion({
  question,
  answers,
  onAnswer,
  onNext,
}: HRAContainerQuestionProps) {
  const [currentChildIndex, setCurrentChildIndex] = useState(0)
  const children = question.children || []
  const currentChild = children[currentChildIndex]
  const isLastChild = currentChildIndex === children.length - 1

  const handleNext = useCallback(() => {
    if (isLastChild) {
      onNext()
    }
    else {
      setCurrentChildIndex(prev => prev + 1)
    }
  }, [isLastChild, onNext])

  useEffect(() => {
    if (currentChild && answers[currentChild.questionId]) {
      const timer = setTimeout(() => handleNext(), 750)
      return () => clearTimeout(timer)
    }
  }, [answers, currentChild, handleNext])

  if (!currentChild)
    return null

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="text-xl font-medium">{question.questionText}</h3>
        <p className="mt-2 text-sm text-gray-500">
          Activity
          {' '}
          {currentChildIndex + 1}
          {' '}
          of
          {' '}
          {children.length}
        </p>
      </div>

      <div className="mb-6">
        <h4 className="mb-4 text-lg font-medium">{currentChild.questionText}</h4>
        {currentChild.answerType === 'Select Single' && (
          <div className="w-full flex flex-col space-y-2">
            {currentChild.answerPicklistChoices?.map((choice: string) => (
              <Button
                key={choice}
                variant={answers[currentChild.questionId] === choice ? 'default' : 'outline'}
                className="w-full items-center justify-center"
                onClick={() => onAnswer(currentChild.questionId, choice)}
              >
                {choice}
              </Button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentChildIndex(prev => Math.max(0, prev - 1))}
          disabled={currentChildIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!answers[currentChild.questionId]}
        >
          {isLastChild ? 'Continue' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

export default HRAContainerQuestion
