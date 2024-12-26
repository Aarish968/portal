import React from 'react'

interface HRAQuestionCardContainerProps {
  children: React.ReactNode
}

function HRAQuestionCardContainer({ children }: HRAQuestionCardContainerProps) {
  return (
    <div className=":uno: w-full flex flex-col space-y-6">
      <div className=":uno: mx-auto flex flex-col space-y-2">
        {children}
      </div>
    </div>
  )
}

export default HRAQuestionCardContainer
