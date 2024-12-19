import { Button } from '@/base_submod/components/ui/button'

interface HRAQuestionContinueButtonProps {
  disabled: boolean
  onNext: () => void
}

function HRAQuestionContinueButton({ disabled, onNext }: HRAQuestionContinueButtonProps) {
  return (
    <div className=":uno: flex justify-center">
      <div>
        <Button
          className=":uno: w-full rounded-full bg-[#4A3880] hover:bg-[#4A3880]/90"
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
