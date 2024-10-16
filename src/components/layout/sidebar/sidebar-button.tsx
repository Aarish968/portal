import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/base_submod/components/ui/tooltip'
import type { SiteLink } from '@/base_submod/schemas/router'

interface SidebarButtonProps {
  link: SiteLink
  isActive: boolean
}

function SidebarButton({ link, isActive }: SidebarButtonProps) {
  return (
    <div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={link.href}
            className=":uno: no-underline font-semibold"
          >
            <div className={`:uno: w-full flex items-center gap-2 rounded-md px-2 py-1 ${
            isActive
              ? 'text-main-bright-purple bg-light-purple-50'
              : 'text-bp-300 hover:text-main-bright-purple hover:bg-light-purple-50'
          }`}
            >
              <Icon icon={link.icon ?? ''} className=":uno: h-5 w-5 flex-shrink-0" />
              <div className=":uno: font-sans no-underline">{link.title}</div>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{link.menuDescription}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export default SidebarButton
