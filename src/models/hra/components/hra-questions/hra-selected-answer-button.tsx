import { Check } from 'lucide-react'
import { Button } from '@/base_submod/components/ui/button'

interface HRASelectedAnswerButtonProps {
  isSelected: boolean
  onClick: () => void
  children: React.ReactNode
}

function HRASelectedAnswerButton({
  isSelected,
  onClick,
  children,
}: HRASelectedAnswerButtonProps) {
  return (
    <Button
      variant={isSelected ? 'selected' : 'outline'}
      onClick={onClick}
      className=":uno: min-w-[242px] !normal-case"
    >
      {isSelected && <Check className=":uno: absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />}
      {children}
    </Button>
  )
}

export default HRASelectedAnswerButton
