import { Button } from '@/base_submod/components/ui/button'
import { Checkbox } from '@/base_submod/components/ui/checkbox'

interface HRAConfirmBarProps {
  isConfirmed: boolean
  onConfirmChange: (checked: boolean) => void
  onSubmit: () => void
}

function HRAConfirmBar({ isConfirmed, onConfirmChange, onSubmit }: HRAConfirmBarProps) {
  return (
    <div className=":uno: fixed bottom-0 left-[170px] right-0 border-t bg-white p-4">
      <div className=":uno: w-full flex items-center justify-between">
        <div className=":uno: flex items-center space-x-2">
          <Checkbox
            id="confirm"
            checked={isConfirmed}
            onCheckedChange={checked => onConfirmChange(checked as boolean)}
          />
          <label
            htmlFor="confirm"
            className=":uno: cursor-pointer text-sm text-gray-700"
          >
            I confirm that the following information is accurate and complete.
          </label>
        </div>
        <Button
          className=":uno: rounded-full bg-[#4A3880] px-8 hover:bg-[#4A3880]/90"
          disabled={!isConfirmed}
          onClick={onSubmit}
        >
          Submit HRA
        </Button>
      </div>
    </div>
  )
}

export default HRAConfirmBar
