import { Link } from 'react-router-dom'
import type { SiteLink } from '@/base_submod/schemas/router'
import SidebarButtonContent from '@/components/layout/sidebar/sidebar-button-content'

interface SidebarButtonLinkProps {
  link: SiteLink
  isActive: boolean
  isExpanded: boolean
}

function SidebarButtonLink({ link, isActive, isExpanded }: SidebarButtonLinkProps) {
  return (
    <Link to={link.href} className={`:uno: relative flex items-center px-8 py-3 no-underline color-trans font-semibold focus:bg-primary-lightest !text-dark-cyan focus:outline-primary focus:!text-[#000] group-hover:!text-[#000]` + ` ${isActive ? ':uno: !text-[#000]' : ''}`}>
      <SidebarButtonContent link={link} isActive={isActive} isExpanded={isExpanded} />
    </Link>
  )
}

export default SidebarButtonLink
