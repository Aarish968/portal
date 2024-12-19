import { Icon } from '@iconify/react'
import { Button } from '@/base_submod/components/ui/button'

interface HRAQuestionPreviousButtonProps {
  onClick: () => void
  disabled: boolean
}

function HRAQuestionPreviousButton({ onClick, disabled }: HRAQuestionPreviousButtonProps) {
  return (
    <div>
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        size="icon"
        className=":uno: h-9 w-9"
      >
        <Icon icon="ph:caret-left-bold" className=":uno: mb-1 h-4 w-4 shrink-0" />
      </Button>
    </div>
  )
}

export default HRAQuestionPreviousButton
