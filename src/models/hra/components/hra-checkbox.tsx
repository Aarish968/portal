import { Checkbox } from '@/base_submod/components/ui/checkbox'

interface HRACheckboxProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function HRACheckbox({ id, label, checked, onCheckedChange, className }: HRACheckboxProps) {
  return (
    <div className=":uno: w-full flex items-center space-x-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        variant="choice"
        className={`:uno: !h-7 !w-7 ${className || ''}`}
      />
      <label
        htmlFor={id}
        className=":uno: select-none text-balance leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  )
}
