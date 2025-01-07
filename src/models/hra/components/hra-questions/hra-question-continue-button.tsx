import { useEffect } from 'react'
import { Button } from '@/base_submod/components/ui/button'
import { useDebounceClick } from '@/hooks/use-debounce-click'

interface HRAQuestionContinueButtonProps {
  disabled: boolean
  onNext: () => void
}

function HRAQuestionContinueButton({ disabled, onNext }: HRAQuestionContinueButtonProps) {
  const { handleClick, isDebouncing } = useDebounceClick(onNext)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !disabled && !isDebouncing) {
        e.preventDefault()
        handleClick()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [disabled, isDebouncing, handleClick])

  return (
    <div className=":uno: flex justify-center pt-6">
      <div>
        <Button
          className=":uno: min-w-[211px] w-full rounded-full !bg-[#352368] !normal-case hover:!bg-[#352368]/90"
          disabled={disabled || isDebouncing}
          onClick={handleClick}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default HRAQuestionContinueButton
