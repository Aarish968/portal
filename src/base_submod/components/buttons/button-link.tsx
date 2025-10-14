import { Link } from 'react-router-dom'
import type { ButtonProps } from '@/base_submod/components/ui/button'
import { Button } from '@/base_submod/components/ui/button'

interface ButtonLinkProps {
  to: string
  text?: string
  children?: React.ReactNode
  className?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}

function ButtonLink({ to, text, children, className, variant = 'default', size = 'default' }: ButtonLinkProps) {
  return (
    <Button className={`:uno: ${className}`} variant={variant} size={size} asChild>
      <Link to={to} className=":uno: select-none no-underline font-bold hover:text-white">
        {children || text }
      </Link>
    </Button>
  )
}

export default ButtonLink
