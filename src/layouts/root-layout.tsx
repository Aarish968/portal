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
      {/* <Header /> */}
      <div className=":uno: mb-12 mt-6 flex flex-grow">
        {/* <Sidebar /> */}
        <div className=":uno: page-width flex-1 transition-all duration-300">
          <main className=":uno: relative flex flex-1 overflow-auto section-padding">
            {children}
          </main>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default RootLayout
