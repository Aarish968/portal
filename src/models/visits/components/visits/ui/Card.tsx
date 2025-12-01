import React from 'react'

type SimpleProps = { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties 
}

export const Card = ({ children, className = '', onClick, style }: SimpleProps) => (
  <div className={`bg-white rounded-lg ${className}`} onClick={onClick} style={style}>
    {children}
  </div>
)

export const CardContent = ({ children, className = '' }: SimpleProps) => (
  <div className={className}>{children}</div>
)
