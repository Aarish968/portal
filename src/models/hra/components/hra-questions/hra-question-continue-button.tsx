import { useEffect } from 'react'
import { Button } from '@/base_submod/components/ui/button'

interface HRAQuestionContinueButtonProps {
  disabled: boolean
  onNext: () => void
}

function HRAQuestionContinueButton({ disabled, onNext }: HRAQuestionContinueButtonProps) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled) {
        e.preventDefault()
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [disabled, onNext])

  return (
    <div className=":uno: flex justify-center pt-6">
      <div>
        <Button
          className=":uno: min-w-[211px] w-full rounded-full !bg-[#352368] !normal-case hover:!bg-[#352368]/90"
          disabled={disabled}
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default HRAQuestionContinueButton
