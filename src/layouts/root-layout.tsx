import type { ReactNode } from 'react'
import Sidebar from '@/components/layout/sidebar/sidebar'

interface RootLayoutProps {
  children: ReactNode
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className=":uno: relative relative min-h-screen w-full flex flex-col transition-all duration-400 ease-in-out">
      <div className=":uno: grid grid-cols-6 flex flex-grow">
        <Sidebar />
        <div className=":uno: page-width flex-1 pl-156px">
          <main className=":uno: relative flex flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default RootLayout
