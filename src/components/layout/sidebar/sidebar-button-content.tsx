import type { SiteLink } from '@/base_submod/schemas/router'

interface SidebarButtonLinkProps {
  link: SiteLink
  isActive: boolean
}

function SidebarButtonContent({ link, isActive }: SidebarButtonLinkProps) {
  return (
    <div className=":uno: flex items-center gap-2">
      <span className=":uno: invisible whitespace-nowrap font-bold">{link.title}</span>
      <span className={':uno: absolute left-4 top-1/2 whitespace-nowrap transition-all duration-100 font-medium -translate-y-1/2 group-hover:font-semibold ' + ` ${isActive ? ':uno: font-semibold' : ''}`}>{link.title}</span>
    </div>
  )
}

export default SidebarButtonContent
