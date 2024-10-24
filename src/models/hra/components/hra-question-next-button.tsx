import { Icon } from '@iconify/react'
import { Button } from '@/base_submod/components/ui/button'

interface HRAQuestionNextButtonProps {
  onClick: () => void
  isLastQuestion: boolean
}

function HRAQuestionNextButton({ onClick, isLastQuestion }: HRAQuestionNextButtonProps) {
  return (
    <Button
      variant="outline"
      size={isLastQuestion ? 'sm' : 'icon'}
      className={isLastQuestion ? 'px-4 py-2' : 'h-9 w-9'}
      onClick={onClick}
    >
      {isLastQuestion
        ? (
            'Finish'
          )
        : (
            <Icon icon="ph:caret-right-bold" className="h-4 w-4 shrink-0" />
          )}
    </Button>
  )
}

export default HRAQuestionNextButton
