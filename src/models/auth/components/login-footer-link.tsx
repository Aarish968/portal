import { Button } from '@/base_submod/components/ui/button'

interface LoginFooterLinkProps {
  label: string
  href?: string
}

function LoginFooterLink({ label, href = '#' }: LoginFooterLinkProps) {
  return (
    <div className=":uno: mx-auto">
      <Button variant="loginFooterLink" size="link" asChild>
        <a href={href}>{label}</a>
      </Button>
    </div>
  )
}

export default LoginFooterLink
