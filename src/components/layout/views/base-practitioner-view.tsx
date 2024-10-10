import type { ReactNode } from 'react'

interface BasePractitionerViewProps {
  children: ReactNode
  title: string
  description?: string
  actionButton?: ReactNode

}

function BasePractitionerView({ children, title, description, actionButton }: BasePractitionerViewProps) {
  return (
    <div className=":uno: min-h-screen w-full">
      <div className=":uno: grid w-full px-16 pt-10 md:gap-4">
        <div className=":uno: flex flex-col gap-2">
          <div className=":uno: flex flex-wrap items-center justify-between gap-2">
            <div className=":uno: text-20px leading-14px font-bold">{title}</div>
            {actionButton}
          </div>
          {description && <div className=":uno: leading-18px">{description}</div>}
        </div>
        <div className=":uno: w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default BasePractitionerView
