import React from 'react'
import type { SiteLink } from '@/base_submod/schemas/router'
import SidebarButtonLink from '@/components/layout/sidebar/sidebar-button-link'

interface SidebarButtonProps {
  index: number
  link: SiteLink
  links: SiteLink[]
  isActive: boolean
  isExpanded: boolean
}

const SidebarButton = React.forwardRef<HTMLDivElement, SidebarButtonProps>(
  ({ index, link, links, isActive, isExpanded }, ref) => {
    return (
      <div
        ref={ref}
        className={':uno: group color-trans hover:bg-primary-light-bg ' + ` ${index === 0 ? ':uno: rounded-t-2xl' : ''} ${index === links.length - 1 ? ':uno: rounded-b-2xl' : ''} ${isActive ? ':uno: !bg-primary-lightest' : ''}`}
      >
        <SidebarButtonLink
          link={link}
          isActive={isActive}
          isExpanded={isExpanded}
        />
      </div>
    )
  },
)

SidebarButton.displayName = 'SidebarButton'

export default SidebarButton
