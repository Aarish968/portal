import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/base_submod/lib/utils'

const buttonVariants = cva(
  ':uno: text-16px tracking-1.2px leading-18px font-semibold inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary-main disabled:pointer-events-none disabled:opacity-50 color-trans uppercase select-none max-w-40ch pt-1 text-balance',
  {
    variants: {
      variant: {
        default: ':uno: border bg-primary-light text-white hover:bg-primary-light-hover primary-button-shadow',
        login: ':uno: bg-#e77600 hover:bg-#f9a661 uppercase !text-white text-15px leading-19px shadow-md',
        destructive:
          ':uno: bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          ':uno: text-dark-cyan font-semibold border border-main-black/60 hover:border-main-black hover:bg-main-black/03',
        outlineSecondary:
          ':uno: text-gray-400 font-semibold border border-gray-400 hover:border-main-black hover:bg-main-black/03 hover:text-dark-cyan w-full sm:w-auto flex-grow shadow-md',
        secondary:
          ':uno: border bg-secondary-main text-text-main hover:bg-secondary-muted',
        ghost: ':uno: text-#726f81 hover:text-link-light border border-transparent hover:border-accent-muted ',
        link: ':uno: text-link-color hover:text-link-lightest underline-offset-4 hover:underline',
        linkSmall: ':uno: text-link-color hover:text-link-lightest underline underline-offset-4 text-11px leading-22px',
        loginFooterLink: ':uno: text-link hover:text-link-light text-16px leading-21px underline-offset-4 hover:underline',
        filterActive: ':uno: text-primary-light font-normal hover:text-link-lightest underline underline-offset-3',
        filter: ':uno: text-gray-filter-text font-normal hover:text-link-lightest underline-offset-3',
        selected: ':uno: rounded-40px border-solid border-[1px] border-[#352368] bg-[#E5DFEE] focus:border-[1px] focus:border-[#352368] relative text-[#352368]',
      },
      size: {
        default: ':uno: min-h-10 px-6',
        xs: ':uno: rounded-full px-2 py-1 !text-11px min-w-124px max-w-144px',
        sm: ':uno: h-8 rounded-full px-2 ',
        lg: ':uno: h-11 rounded-full px-8',
        link: ':uno: h-8 px-1 !rounded-md',
        linkSm: ':uno: h-8 !rounded-md !w-auto px-1',
        icon: ':uno: h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
