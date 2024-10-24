import { useLocation } from 'react-router-dom'
import SidebarButton from './sidebar-button'
import SidebarUserInfo from './sidebar-user-info'
import { SidebarLinks } from '@/data/routing/site-links'
import { TooltipProvider } from '@/base_submod/components/ui/tooltip'
import PorterLogo from '@/base_submod/components/misc/porter-logo'

function Sidebar() {
  const location = useLocation()

  return (
    <div
      className=":uno: fixed col-span-1 min-h-screen min-w-160px flex flex-col bg-white transition-all duration-300 !z-10"
    >
      <div className=":uno: z-10 w-full flex-grow px-3 py-4 transition-all duration-400">
        <div className=":uno: w-full overflow-hidden">
          <div className=":uno: mx-auto mb-4 w-full flex justify-center">
            <PorterLogo variant="dark" />
          </div>
          <TooltipProvider>
            <div className=":uno: space-y-1">
              {SidebarLinks.map(link => (
                link && (
                  <SidebarButton
                    key={link.href}
                    link={link}
                    isActive={location.pathname === link.href}
                  />
                )
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>
      <SidebarUserInfo />
    </div>
  )
}

export default Sidebar
