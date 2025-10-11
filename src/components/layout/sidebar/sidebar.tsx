import { useLocation } from 'react-router-dom'
import SidebarButton from './sidebar-button'
import SidebarUserInfo from './sidebar-user-info'
import { SidebarLinks } from '@/data/routing/site-links'
import { TooltipProvider } from '@/base_submod/components/ui/tooltip'
import PorterLogo from '@/base_submod/components/misc/porter-logo'
import type { AuthUser } from '@/models/auth/schemas/auth-schema'

interface SidebarProps {
  user: AuthUser | null
}

function Sidebar({ user }: SidebarProps) {
  const location = useLocation()

  return (
    <div
      className=":uno: fixed left-0 top-0 w-64 h-screen flex flex-col bg-white transition-all duration-300 !z-10"
    >
      {/* Scrollable content area */}
      <div className=":uno: flex-1 overflow-y-auto">
        <div className=":uno: px-3 py-4">
          <div className=":uno: mx-auto mb-4 w-full flex justify-center">
            <PorterLogo variant="dark" />
          </div>
          <TooltipProvider>
            <div className=":uno: space-y-2">
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
      {/* Fixed user info at bottom */}
      <div className=":uno: flex-shrink-0">
        <SidebarUserInfo name={user?.name ?? 'Guest User'} />
      </div>
    </div>
  )
}

export default Sidebar
