import { useState, useEffect } from 'react'
import { VisitCard } from './visit-card'
import ROUTES from '@/data/routing/routes'
import type { TabType, Visit } from '../../types/types'
import { 
  mockVisitsToday, 
  mockVisitsTomorrow, 
  mockVisitsWeek,
  equipmentDataToday,
  equipmentDataTomorrow,
  equipmentDataWeek
} from '../../constants/constants'
import { groupVisitsByDate } from '../../utils/utils'
import { DashboardHeader } from './ui/DashboardHeader'
import { EquipmentSection } from './ui/EquipmentSection'
import { ConsentModals } from './ui/ConsentModals'
import { useVisitState } from '../../hooks/useVisitState'
import { useConsentStatus } from '../../hooks/useConsentStatus'
import { useStickyDateCards } from '../../hooks/useStickyDateCards'
import { useTabUnderline } from '../../hooks/useTabUnderline'
import { dashboardStyles } from './styles/dashboard-styles'
import { useVisitsApi } from '../../hooks/useVisitsApi'
import { useAuthStore } from '@/models/auth/stores/auth-store'
import { transformApiVisitToVisit } from '../../utils/visit-mapper'
import { DebugAuthInfo } from './debug-auth-info'

export function VisitsDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('today')
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false)
  const [time, setTime] = useState('')
  const [transformedVisits, setTransformedVisits] = useState<Visit[]>([])
  const [isLoadingVisits, setIsLoadingVisits] = useState(true)

  const { getVisits, error: apiError } = useVisitsApi()
  const currentUser = useAuthStore(state => state.currentUser)
  
  // Use transformed API visits if available, otherwise use mock data
  const visitsData = transformedVisits.length > 0 ? transformedVisits : mockVisitsToday
  const { visits: visitsToday, refreshVisitStates } = useVisitState(visitsData)
  
  const {
    showConsentModal,
    showConsentConfirmation,
    showConsentLoading,
    showConsentSuccess,
    pendingConsentData,
    setShowConsentModal,
    handleConsentConfirmation,
    handleCloseConsentConfirmation
  } = useConsentStatus(refreshVisitStates, setTime)
  
  const [localConsentLoading, setLocalConsentLoading] = useState(false)
  const [localConsentSuccess, setLocalConsentSuccess] = useState(false)

  const { todayTabRef, tomorrowTabRef, weekTabRef, underlineStyle } = useTabUnderline(activeTab)

  const currentVisits = activeTab === 'today' ? visitsToday : activeTab === 'tomorrow' ? mockVisitsTomorrow : mockVisitsWeek
  const currentEquipment = activeTab === 'today' ? equipmentDataToday : activeTab === 'tomorrow' ? equipmentDataTomorrow : equipmentDataWeek
  const equipmentCount = currentEquipment.length
  const visitCount = currentVisits.length

  const groupedVisits = groupVisitsByDate(currentVisits)
  const { dateRefs, dateSectionRefs } = useStickyDateCards(activeTab, groupedVisits)

  useEffect(() => {
    const fetchVisits = async () => {
      // Use username field instead of email
      const userEmail = currentUser?.username || currentUser?.idTokenClaims?.preferred_username
      
      if (userEmail) {
        setIsLoadingVisits(true)
        console.log('Fetching visits for:', userEmail)
        try {
          const data = await getVisits(userEmail)
          if (data && data.length > 0) {
            console.log('API visits received:', data.length, 'visits')
            // Transform API response to Visit format
            const transformed = data.map((apiVisit, index) => transformApiVisitToVisit(apiVisit, index))
            setTransformedVisits(transformed)
          } else {
            console.log('No API data received, using mock data')
          }
        } catch (error) {
          console.error('Error fetching visits:', error)
        } finally {
          setIsLoadingVisits(false)
        }
      } else {
        console.log('No user found, using mock data')
        setIsLoadingVisits(false)
      }
    }
    fetchVisits()
  }, [currentUser, getVisits])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: any = { hour: '2-digit', minute: '2-digit', hour12: true }
      setTime(now.toLocaleTimeString('en-US', options))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      // Placeholder for focus handling
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const handleCollectConsent = () => {
    setShowConsentModal(false)

    const visitId = pendingConsentData?.visitId || currentVisits[0]?.id

    if (visitId) {
      sessionStorage.setItem('fromConsentPage', 'true')
      sessionStorage.setItem('currentVisitId', visitId)

      const visit = currentVisits.find(v => v.id === visitId)
      if (visit) {
        sessionStorage.setItem(`visit-${visitId}`, JSON.stringify(visit))
      }

      window.open(`${ROUTES.app.consentForms.href}?visitId=${visitId}`, '_blank')
    }
  }

  const handleRetryCheck = () => {
    setShowConsentModal(false)
    setLocalConsentLoading(true)

    setTimeout(() => {
      setLocalConsentLoading(false)
      setLocalConsentSuccess(true)

      setTimeout(() => {
        setLocalConsentSuccess(false)
      }, 1000)
    }, 2000)
  }

  const getSectionTitle = () => {
    if (activeTab === 'today') return "Today's Visits"
    if (activeTab === 'tomorrow') return "Tomorrow's Visits"
    return 'Upcoming Visits'
  }

  return (
    <div className="min-h-screen bg-gray-85 w-full overflow-x-hidden">
      <style>{dashboardStyles}</style>
      
      {/* Temporary debug component - remove after fixing */}
      <DebugAuthInfo />

      <DashboardHeader
        time={time}
        activeTab={activeTab}
        todayTabRef={todayTabRef}
        tomorrowTabRef={tomorrowTabRef}
        weekTabRef={weekTabRef}
        underlineStyle={underlineStyle}
        onTabChange={setActiveTab}
      />

      <div className="pt-40 sm:pt-36 md:pt-35 px-4 sm:px-6 pb-6 flex-1 overflow-x-hidden mobile-content" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        <EquipmentSection
          activeTab={activeTab}
          currentEquipment={currentEquipment}
          visitCount={visitCount}
          equipmentCount={equipmentCount}
          isExpanded={isEquipmentExpanded}
          onToggle={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
        />

        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-medium mb-0" style={{ color: '#1b1b1b' }}>
            {getSectionTitle()}
          </h3>
          {isLoadingVisits && (
            <p className="text-sm text-gray-500 mt-2">Loading visits from API...</p>
          )}
          {apiError && (
            <p className="text-sm text-red-600 mt-2">Error loading visits: {apiError}</p>
          )}
          {!isLoadingVisits && transformedVisits.length > 0 && (
            <p className="text-sm text-green-600 mt-2">✓ Showing {transformedVisits.length} visit(s) from API</p>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6 w-full visits-section-container" style={{ maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          {activeTab === 'week' ? (
            <>
              {Object.entries(groupedVisits).map(([date, visits]) => (
                <div key={date} className="w-full date-section-container" ref={el => dateSectionRefs.current[date] = el} style={{ maxWidth: '100%', overflow: 'hidden' }}>
                  <div className="date-card-wrapper" style={{ minHeight: 'fit-content', maxWidth: '100%' }}>
                    <div
                      ref={el => dateRefs.current[date] = el}
                      className="date-card rounded-lg px-3 sm:px-4 py-3 w-full"
                      style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                    >
                      <h4 className="text-sm font-medium mb-1">{date}</h4>
                      <span className="text-xs font-medium" style={{ color: '#939090' }}>
                        {visits.length} {visits.length === 1 ? 'Visit' : 'Visits'} Scheduled
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-white rounded-lg shadow-sm white-container" style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', padding: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
                    <div className="visits-grid-week" style={{ maxWidth: '100%', width: '100%' }}>
                      {visits.map(v => (
                        <div key={v.id} style={{ maxWidth: '100%', width: '100%' }}>
                          <VisitCard visit={v} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="visits-grid-today">
              {currentVisits.map((visit) => (
                <div key={visit.id}>
                  <VisitCard visit={visit} />
                </div>
              ))}
            </div>
          )}
        </div>

        <ConsentModals
          showConsentModal={showConsentModal}
          showConsentConfirmation={showConsentConfirmation}
          showConsentLoading={localConsentLoading || showConsentLoading}
          showConsentSuccess={localConsentSuccess || showConsentSuccess}
          pendingConsentData={pendingConsentData}
          currentVisits={currentVisits}
          onCloseConsentModal={() => setShowConsentModal(false)}
          onCloseConsentConfirmation={handleCloseConsentConfirmation}
          onConsentConfirmation={handleConsentConfirmation}
          onCollectConsent={handleCollectConsent}
          onRetryCheck={handleRetryCheck}
        />
      </div>
    </div>
  )
}
