import { Icon } from '@iconify/react'
import type { SiteLink } from '@/base_submod/schemas/router'

interface SidebarButtonLinkProps {
  link: SiteLink
  isActive: boolean
  isExpanded: boolean
}

function SidebarButtonContent({ link, isActive, isExpanded }: SidebarButtonLinkProps) {
  return (
    <div className=":uno: flex items-center gap-2">
      {link.icon && <Icon icon={link.icon} className=":uno: absolute left-5 top-1/2 size-5 -translate-y-1/2" />}
      <span className=":uno: invisible whitespace-nowrap font-bold">{link.title}</span>
      <span className={':uno: absolute left-12 top-1/2 whitespace-nowrap transition-all duration-100 font-medium -translate-y-1/2 group-hover:font-semibold ' + ` ${isExpanded ? ':uno: opacity-100' : ':uno: opacity-0'} ${isActive ? ':uno: font-semibold' : ''}`}>{link.title}</span>
    </div>
  )
}

export default SidebarButtonContent
