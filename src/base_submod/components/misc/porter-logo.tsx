import PorterLogoHorizontalLight from '@/base_submod/assets/images/logos/porter-logo-horizontal-light.svg'
import PorterLogoHorizontalDark from '@/base_submod/assets/images/logos/porter-logo-horizontal-dark.svg'

interface PorterLogoProps {
  variant?: 'light' | 'dark'
}

function PorterLogo({ variant = 'light' }: PorterLogoProps) {
  return (
    <img src={variant === 'light' ? PorterLogoHorizontalLight : PorterLogoHorizontalDark} alt="Porter Logo" />
  )
}

export default PorterLogo
