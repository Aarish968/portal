import type { ReactNode } from 'react'
import Sidebar from '@/components/layout/sidebar/sidebar'
import PorterDevTools from '@/base_submod/components/dev/porter-dev-tools'
import { useAuthStore } from '@/models/auth/stores/auth-store'
import AuthDisabledBanner from '@/base_submod/components/dev/auth-disabled-banner'
import { useAuthCheck } from '@/models/auth/hooks/use-auth-check'

interface RootLayoutProps {
  children: ReactNode
}

function RootLayout({ children }: RootLayoutProps) {
  const { isAuthDisabled, currentUser } = useAuthStore()
  useAuthCheck()

  return (
    <>
      <AuthDisabledBanner isAuthDisabled={isAuthDisabled} />
      <div className=":uno: relative min-h-screen w-full flex flex-col transition-all duration-400 ease-in-out">
        <div className=":uno: absolute right-1 top-1 z-20">
          <PorterDevTools>
            <div>
              yo
            </div>
          </PorterDevTools>
        </div>
        <div className=":uno: grid grid-cols-6 flex flex-grow">
          <Sidebar user={currentUser} />
          <div className=":uno: page-width flex-1 pl-156px">
            <main className=":uno: relative flex flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

export default RootLayout
