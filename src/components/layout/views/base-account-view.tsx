import type { ReactNode } from 'react'

interface BaseAccountViewProps {
  children: ReactNode
  title: string
  actionButton?: ReactNode
}

function BaseAccountView({ children, title, actionButton }: BaseAccountViewProps) {
  return (
    <div className=":uno: gap-w grid w-full md:gap-4">
      <div className=":uno: flex flex-wrap justify-between gap-2">
        <h4>{title}</h4>
        {actionButton}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default BaseAccountView
