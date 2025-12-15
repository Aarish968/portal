import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { VisitCard } from './visit-card'
import ROUTES from '@/data/routing/routes'
import type { TabType, Visit } from '../../types/types'
import { groupVisitsByDate, generateEquipmentFromVisits } from '../../utils/utils'
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
import { STORAGE_KEYS } from '../../constants'


export function VisitsDashboard() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<TabType>('today')
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false)
  const [time, setTime] = useState('')
  const [transformedVisits, setTransformedVisits] = useState<Visit[]>([])
  const [isLoadingVisits, setIsLoadingVisits] = useState(true)
  const [renderKey, setRenderKey] = useState(0)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const { getVisits, error: apiError } = useVisitsApi()
  const currentUser = useAuthStore(state => state.currentUser)
  
  // Use only API visits
  const { visits: visitsToday, refreshVisitStates } = useVisitState(transformedVisits)
  
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

  // Get today and tomorrow dates in Atlanta timezone for filtering
  const getTodayAndTomorrowDates = () => {
    const now = new Date()
    const atlantaToday = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
    const todayDate = new Date(atlantaToday.getFullYear(), atlantaToday.getMonth(), atlantaToday.getDate())
    const tomorrowDate = new Date(todayDate)
    tomorrowDate.setDate(tomorrowDate.getDate() + 1)
    
    // Format as YYYY-MM-DD for comparison
    const formatDateString = (date: Date): string => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    return {
      today: formatDateString(todayDate),
      tomorrow: formatDateString(tomorrowDate)
    }
  }

  // Filter visits based on active tab using actual dates
  const getCurrentVisits = () => {
    const { today, tomorrow } = getTodayAndTomorrowDates()
    
    if (activeTab === 'today') {
      // Show visits for today's actual date (e.g., 2024-01-13)
      return visitsToday.filter(v => v.visitDate === today)
    } else if (activeTab === 'tomorrow') {
      // Show visits for tomorrow's actual date (e.g., 2024-01-14)
      return visitsToday.filter(v => v.visitDate === tomorrow)
    } else {
      // Week view - show visits for dates after tomorrow (e.g., 2024-01-15, 2024-01-16, etc.)
      return visitsToday.filter(v => {
        if (!v.visitDate) return false
        // Compare dates: visit date should be after tomorrow
        return v.visitDate > tomorrow
      })
    }
  }
  
  const currentVisits = getCurrentVisits()
  
  // Generate equipment data from actual visits
  const currentEquipment = React.useMemo(() => {
    if (activeTab === 'today') {
      return generateEquipmentFromVisits(currentVisits)
    } else if (activeTab === 'tomorrow') {
      return generateEquipmentFromVisits(currentVisits)
    } else {
      // Week view - use all visits
      return generateEquipmentFromVisits(visitsToday)
    }
  }, [activeTab, currentVisits, visitsToday])
  
  const equipmentCount = currentEquipment.length
  const visitCount = currentVisits.length

  const groupedVisits = groupVisitsByDate(currentVisits)
  const { dateRefs, dateSectionRefs } = useStickyDateCards(activeTab, groupedVisits)

  // Force re-render when navigating back to dashboard
  useEffect(() => {
    setRenderKey(prev => prev + 1)
  }, [location.pathname])

  useEffect(() => {
    const fetchVisits = async () => {
      // Use username field instead of email
      const userEmail = currentUser?.username || currentUser?.idTokenClaims?.preferred_username
      
      if (userEmail && !hasLoadedOnce) {
        setIsLoadingVisits(true)
        setHasLoadedOnce(true)
        try {
          console.log('Dashboard: Fetching visits from API...')
          const data = await getVisits(userEmail)
          
          if (data && data.length > 0) {
            console.log('Dashboard: Received API data, transforming visits...')
            // Transform API response to Visit format
            const transformed = data.map((apiVisit, index) => transformApiVisitToVisit(apiVisit, index))
            
            // Sync API consent data to localStorage for each visit (but preserve existing visit states)
            transformed.forEach(visit => {
              // Handle consent forms
              if (visit.consentForms && visit.consentForms.length > 0) {
                const consentStatus = {
                  hipaa: visit.consentForms.find(cf => cf.name === 'HIPAA Authorization')?.completed || false,
                  privacy: visit.consentForms.find(cf => cf.name === 'Notice of Privacy Practices')?.completed || false,
                  treatment: visit.consentForms.find(cf => cf.name === 'Treatment Consent')?.completed || false,
                  submitted: true // Mark as submitted since this data comes from API
                }

                // Always update consent data from backend so latest changes are reflected
                // This prevents stale localStorage data from hiding new backend updates
                localStorage.setItem(STORAGE_KEYS.CONSENT_STATUS(visit.id), JSON.stringify(consentStatus))
              }
              
              // Preserve existing visit state data (user's manual updates)
              // Don't overwrite if user has already made changes
              const existingVisitState = localStorage.getItem(`visit-state-${visit.id}`)
              if (existingVisitState) {
                try {
                  const parsedState = JSON.parse(existingVisitState)
                  // If user has made changes (has outcomes), preserve them
                  if (parsedState.outcomes && Object.keys(parsedState.outcomes).length > 0) {
                    console.log(`Dashboard: Preserving existing visit state for ${visit.id}:`, parsedState.outcomes)
                    // Keep the existing state, don't overwrite with API data
                    return
                  }
                } catch {
                  // If parsing fails, continue with API data
                }
              }
            })
            
            // Force a small delay to ensure localStorage is updated before rendering
            setTimeout(() => {
              setTransformedVisits(transformed)
              setRenderKey(prev => prev + 1) // Force re-render of VisitCards
            }, 100) // Increased delay to ensure localStorage operations complete

          } else {
            setTransformedVisits([])
          }
        } catch (error) {
          setTransformedVisits([])
        } finally {
          setIsLoadingVisits(false)
        }
      } else if (!userEmail) {
        setIsLoadingVisits(false)
        setTransformedVisits([])
      }
    }
    fetchVisits()
  }, [currentUser, hasLoadedOnce])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: any = { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'America/New_York' // Atlanta is in Eastern Time
      }
      setTime(now.toLocaleTimeString('en-US', options))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      // Force re-render of visit cards when window gains focus (user navigates back)
      setRenderKey(prev => prev + 1)
    }

    const handleVisibilityChange = () => {
      // Force re-render when page becomes visible (user navigates back)
      if (!document.hidden) {
        setRenderKey(prev => prev + 1)
      }
    }

    const handleLocalStorageChange = (e: CustomEvent) => {
      // Force re-render when visit state changes
      if (e.detail.key && e.detail.key.startsWith('visit-state-')) {
        setRenderKey(prev => prev + 1)
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener)
    }
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
        </div>

        <div className="space-y-4 sm:space-y-6 w-full visits-section-container" style={{ maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          {activeTab === 'week' ? (
            <>
              {!isLoadingVisits && Object.keys(groupedVisits).length === 0 ? (
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                  <p className="text-gray-600">No data found</p>
                </div>
              ) : (
                Object.entries(groupedVisits).map(([date, visits]) => (
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
                          <div key={`${v.id}-${renderKey}`} style={{ maxWidth: '100%', width: '100%' }}>
                            <VisitCard visit={v} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="visits-grid-today">
              {!isLoadingVisits && currentVisits.length === 0 ? (
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                  <p className="text-gray-600">No data found</p>
                </div>
              ) : (
                currentVisits.map((visit) => (
                  <div key={`${visit.id}-${renderKey}`}>
                    <VisitCard visit={visit} />
                  </div>
                ))
              )}
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
