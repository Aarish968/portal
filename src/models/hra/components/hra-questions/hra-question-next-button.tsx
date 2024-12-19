import { Icon } from '@iconify/react'
import { Button } from '@/base_submod/components/ui/button'

interface HRAQuestionNextButtonProps {
  onClick: () => void
  isLastQuestion: boolean
  disabled: boolean
}

function HRAQuestionNextButton({ onClick, isLastQuestion, disabled }: HRAQuestionNextButtonProps) {
  return (
    <div>
      <Button
        variant="outline"
        size={isLastQuestion ? 'sm' : 'icon'}
        className={isLastQuestion ? 'px-4 py-2' : 'h-9 w-9'}
        onClick={onClick}
        disabled={disabled}
      >
        {isLastQuestion
          ? 'Finish'
          : <Icon icon="ph:caret-right-bold" className=":uno: mb-1 h-4 w-4 shrink-0" />}
      </Button>
    </div>
  )
}

export default HRAQuestionNextButton
