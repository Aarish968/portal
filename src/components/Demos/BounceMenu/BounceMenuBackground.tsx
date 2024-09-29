import type { ReactNode } from 'react'

interface BounceMenuBackgroundProps {
  children: ReactNode
}

function BounceMenuBackground({ children }: BounceMenuBackgroundProps) {
  return (
    <div className="relative min-h-300px overflow-hidden rounded-xl bg-[#FFEDD6]">
      <div className="absolute left--10 top-20 h-120 w-120 rounded-full bg-#F9C798 blur-80px" />
      <div className="absolute right--10 top-20 h-180 w-180 rounded-full bg-#F0BEBA blur-110px" />
      {children}
    </div>
  )
}

export default BounceMenuBackground
