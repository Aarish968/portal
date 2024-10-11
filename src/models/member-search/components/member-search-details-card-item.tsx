import { cn } from '@/base_submod/lib/utils'

interface MemberSearchDetailsCardItemProps {
  label: string
  value: string | React.ReactNode
  className?: string
}

function MemberSearchDetailsCardItem({ label, value, className = '' }: MemberSearchDetailsCardItemProps) {
  return (
    <div className={cn(':uno: flex items-center gap-2 p-2', className)}>
      <p className=":uno: font-semibold">
        {label}
        :
      </p>
      <p>{value}</p>
    </div>
  )
}

export default MemberSearchDetailsCardItem
