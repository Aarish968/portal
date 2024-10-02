import type { ReactNode } from 'react'
import Header from '@/components/layout/header/header'
import Footer from '@/components/layout/footer/footer'
import Sidebar from '@/components/layout/sidebar/sidebar'

interface RootLayoutProps {
  children: ReactNode
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className=":uno: relative min-h-screen w-full flex flex-col transition-all duration-400 ease-in-out">
      <Header />
      <div className=":uno: grid grid-cols-6 flex flex-grow">
        <Sidebar />
        <div className=":uno: page-width flex-1">
          <main className=":uno: relative mx-16 mt-10 flex flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default RootLayout
