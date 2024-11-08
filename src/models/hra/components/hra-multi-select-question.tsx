import { Button } from '@/base_submod/components/ui/button'

interface HRAMultiSelectQuestionProps {
  choices: string[]
  answer: string[]
  onAnswer: (answer: string[]) => void
}

function HRAMultiSelectQuestion({
  choices,
  answer = [],
  onAnswer,
}: HRAMultiSelectQuestionProps) {
  const toggleChoice = (choice: string) => {
    if (answer.includes(choice)) {
      onAnswer(answer.filter(item => item !== choice))
    }
    else {
      onAnswer([...answer, choice])
    }
  }

  return (
    <div className="w-full space-y-2">
      {choices?.map((choice: string) => (
        <Button
          key={choice}
          variant={answer.includes(choice) ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => toggleChoice(choice)}
        >
          {choice}
        </Button>
      ))}
    </div>
  )
}

export default HRAMultiSelectQuestion
