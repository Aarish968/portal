import React from 'react'
import type { SiteLink } from '@/base_submod/schemas/router'
import SidebarButtonLink from '@/components/layout/sidebar/sidebar-button-link'

interface SidebarButtonProps {
  link: SiteLink
  isActive: boolean
}

const SidebarButton = React.forwardRef<HTMLDivElement, SidebarButtonProps>(
  ({ link, isActive }, ref) => {
    return (
      <div
        ref={ref}
        className={':uno: group color-trans hover:bg-primary-light-bg ' + `${isActive ? ':uno: !bg-primary-lightest' : ''}`}
      >
        <SidebarButtonLink
          link={link}
          isActive={isActive}
        />
      </div>
    )
  },
)

SidebarButton.displayName = 'SidebarButton'

export default SidebarButton
