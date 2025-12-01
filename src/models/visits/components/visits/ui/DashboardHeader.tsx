import { Bell } from 'lucide-react'
import { TabType } from '../types'

interface DashboardHeaderProps {
  time: string
  activeTab: TabType
  todayTabRef: React.RefObject<HTMLButtonElement>
  tomorrowTabRef: React.RefObject<HTMLButtonElement>
  weekTabRef: React.RefObject<HTMLButtonElement>
  underlineStyle: { width: number; left: number }
  onTabChange: (tab: TabType) => void
}

export function DashboardHeader({
  time,
  activeTab,
  todayTabRef,
  tomorrowTabRef,
  weekTabRef,
  underlineStyle,
  onTabChange
}: DashboardHeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm mobile-header">
      <div className="px-4 sm:px-6 py-4 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 mobile-header-content">
          <div className="mb-3 sm:mb-0">
            <h1 
              className="font-medium text-base sm:text-lg" 
              style={{ 
                color: '#1b1b1b', 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' 
              }}
            >
              Visit Outcomes
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#939090' }}>
              Friday, October 10, 2025
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-end">
              <span className="text-gray-400 text-xs">Current Time</span>
              <span className="font-semibold text-black text-sm">{time}</span>
            </div>
            <button
              className="p-1.5 sm:p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 active:bg-blue-100"
              style={{ backgroundColor: '#F5F5F5' }}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="relative flex pb-3 mobile-tabs" style={{ gap: 'clamp(0.188rem, 3vw, 2rem)' }}>
          <button
            ref={todayTabRef}
            onClick={() => onTabChange('today')}
            className="relative font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base"
            style={{ color: activeTab === 'today' ? '#015F88' : '#6b7280' }}
          >
            Today
          </button>
          <button
            ref={tomorrowTabRef}
            onClick={() => onTabChange('tomorrow')}
            className="relative font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base"
            style={{ color: activeTab === 'tomorrow' ? '#015F88' : '#6b7280' }}
          >
            Tomorrow
          </button>
          <button
            ref={weekTabRef}
            onClick={() => onTabChange('week')}
            className="relative font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base"
            style={{ color: activeTab === 'week' ? '#015F88' : '#6b7280' }}
          >
            Week
          </button>

          <div
            className="absolute bottom-0 transition-all duration-500 ease-in-out z-10"
            style={{
              backgroundColor: '#015F88',
              height: '3px',
              borderRadius: '100px 100px 0 0',
              width: `${underlineStyle.width}px`,
              left: `${underlineStyle.left}px`,
            }}
          />
        </div>

        <div className="h-px bg-gray-300 w-full"></div>
      </div>
    </div>
  )
}
