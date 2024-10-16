import type { ReactNode } from 'react'

interface BasePractitionerViewProps {
  children: ReactNode
  title?: string
  description?: string
  actionButton?: ReactNode
  headerIcon?: ReactNode
}

function BasePractitionerView({ children, title, description, actionButton, headerIcon }: BasePractitionerViewProps) {
  return (
    <div className=":uno: min-h-screen w-full">
      <div className=":uno: grid w-full gap-6 px-12 pt-10">
        {headerIcon}
        <div className=":uno: flex flex-col gap-2">
          <div className=":uno: flex flex-wrap items-center justify-between gap-2">
            <h2 className=":uno: text-20px leading-14px font-bold">{title}</h2>
            {actionButton && <div className=":uno: hidden lg:block">{actionButton}</div>}
          </div>
          {description && <div className=":uno: leading-18px">{description}</div>}
          {actionButton && <div className=":uno: block lg:hidden">{actionButton}</div>}
        </div>
        <div className=":uno: w-full space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default BasePractitionerView
