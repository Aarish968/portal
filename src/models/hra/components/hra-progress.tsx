import { Progress } from '@/base_submod/components/ui/progress'

interface HraProgressProps {
  currentQuestion: number
  totalQuestions: number
}

function HraProgress({ currentQuestion, totalQuestions }: HraProgressProps) {
  const isInitial = currentQuestion === 0
  const progressPercentage = isInitial
    ? 2
    : Math.max(2, (currentQuestion / totalQuestions) * 100)

  return (
    <div className=":uno: w-full flex flex-col">
      <div className=":uno: mb-2 flex select-none justify-between">
        <div>Progress</div>
        <div>
          <p className=":uno: text-center text-sm text-gray-500">
            Question
            {' '}
            {currentQuestion}
            {' '}
            of
            {' '}
            {totalQuestions}
          </p>
        </div>
      </div>
      <Progress value={progressPercentage} className=":uno: w-full" />
    </div>
  )
}

export default HraProgress
