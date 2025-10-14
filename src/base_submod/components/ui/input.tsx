import * as React from 'react'

import { cn } from '@/base_submod/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'custom-autofill min-h-40px flex w-full rounded-md border border-color text-text-main px-3 py-1.5 pt-2 ring-offset-background file:border-0 text-sm file:bg-transparent file:text-sm file:font-medium file:text-main placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:border-0 disabled:cursor-not-allowed disabled:opacity-50 selection:bg-red',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
