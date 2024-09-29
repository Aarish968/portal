import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarLinks } from '@/data/routing/site-links'
import SidebarButton from '@/components/layout/sidebar/sidebar-button'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/base_submod/components/ui/tooltip'

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const location = useLocation()

  return (
    <div
      className=":uno: flex pl-4 transition-all duration-300 !z-10 md:pl-6"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={':uno: z-10 transition-all duration-400 ' + ` ${isExpanded ? ':uno: w-245px' : ':uno: w-16'}`}>
        <div className=":uno: overflow-hidden border-1 border-layout-color rounded-2xl bg-white shadow-md">
          <TooltipProvider>
            {SidebarLinks.map((link, index) => {
              const isActive = location.pathname === link.href
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <SidebarButton
                      index={index}
                      link={link}
                      links={SidebarLinks}
                      isActive={isActive}
                      isExpanded={isExpanded}
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
