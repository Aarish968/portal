import { useLocation } from 'react-router-dom'
import { SidebarLinks } from '@/data/routing/site-links'
import SidebarButton from '@/components/layout/sidebar/sidebar-button'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/base_submod/components/ui/tooltip'
import PorterLogo from '@/base_submod/components/misc/porter-logo'

function Sidebar() {
  const location = useLocation()

  return (
    <div
      className=":uno: fixed col-span-1 min-h-screen min-w-150px flex bg-white transition-all duration-300 !z-10"
    >
      <div className=":uno: z-10 transition-all duration-400">
        <div className=":uno: overflow-hidden bg-white">
          <div className=":uno: mx-auto w-full flex justify-center py-4">
            <PorterLogo variant="dark" />
          </div>
          <TooltipProvider>
            {SidebarLinks.map((link, _index) => {
              const isActive = location.pathname === link.href
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <SidebarButton
                      link={link}
                      isActive={isActive}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{link.menuDescription}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
