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
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(Date.now())
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { getVisits, error: apiError } = useVisitsApi()
  const currentUser = useAuthStore(state => state.currentUser)

  // Reset hasLoadedOnce when user changes
  useEffect(() => {
    setHasLoadedOnce(false)
  }, [currentUser?.username])
  
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
                
                // Only update consent data if no existing consent data exists
                const existingConsentData = localStorage.getItem(STORAGE_KEYS.CONSENT_STATUS(visit.id))
                if (!existingConsentData) {
                  localStorage.setItem(STORAGE_KEYS.CONSENT_STATUS(visit.id), JSON.stringify(consentStatus))
                }
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
          console.log('Dashboard: No data received from API')
          setTransformedVisits([])
        }
      } catch (error) {
        console.error('Dashboard: Error fetching visits:', error)
        setTransformedVisits([])
      } finally {
        setIsLoadingVisits(false)
      }
    } else {
      console.log('Dashboard: Skipping API call - already loaded once and not force refresh')
    }
  }, [currentUser?.username, hasLoadedOnce, isLoadingVisits, getVisits])

  // Initial load effect
  useEffect(() => {
    console.log('Dashboard: Initial load effect triggered')
    console.log('Dashboard: Current user:', currentUser)
    
    if (currentUser) {
      console.log('Dashboard: Username:', currentUser.username)
      console.log('Dashboard: Preferred username:', currentUser.idTokenClaims?.preferred_username)
      
      if (currentUser.username || currentUser.idTokenClaims?.preferred_username) {
        fetchVisits()
      } else {
        console.log('Dashboard: No username found, not calling API')
      }
    } else {
      console.log('Dashboard: Current user is null, waiting for authentication...')
      setIsLoadingVisits(false)
    }
  }, [currentUser])

  // Handle refresh trigger for consent form updates
  useEffect(() => {
    if (refreshTrigger > 0) {
      console.log('Dashboard: Refresh trigger activated, fetching fresh data...')
      fetchVisits(true)
    }
  }, [refreshTrigger])

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

  // Periodic refresh to check for consent updates - DISABLED to prevent network errors
  // useEffect(() => {
  //   const refreshInterval = setInterval(() => {
  //     const now = Date.now()
  //     // Refresh every 2 minutes if data is older than 2 minutes
  //     if (now - lastRefreshTime > 120000) { // 2 minutes
  //       console.log('Dashboard: Periodic refresh check...')
  //       fetchVisits(true)
  //       setLastRefreshTime(now)
  //     }
  //   }, 30000) // Check every 30 seconds

  //   return () => clearInterval(refreshInterval)
  // }, [lastRefreshTime, fetchVisits])

  useEffect(() => {
    const handleFocus = () => {
      // Check if user is returning from consent form
      const fromConsentPage = sessionStorage.getItem('fromConsentPage')
      if (fromConsentPage === 'true') {
        console.log('Dashboard: User returned from consent form, triggering refresh...')
        sessionStorage.removeItem('fromConsentPage')
        // Trigger a refresh by updating the refresh trigger
        setRefreshTrigger(prev => prev + 1)
      } else {
        // Force re-render of visit cards when window gains focus (user navigates back)
        setRenderKey(prev => prev + 1)
      }
    }

    const handleVisibilityChange = () => {
      // Check if user is returning from consent form when page becomes visible
      if (!document.hidden) {
        const fromConsentPage = sessionStorage.getItem('fromConsentPage')
        if (fromConsentPage === 'true') {
          console.log('Dashboard: User returned from consent form (visibility), triggering refresh...')
          sessionStorage.removeItem('fromConsentPage')
          // Trigger a refresh by updating the refresh trigger
          setRefreshTrigger(prev => prev + 1)
        } else {
          // Force re-render when page becomes visible (user navigates back)
          setRenderKey(prev => prev + 1)
        }
      }
    }

    const handleLocalStorageChange = (e: CustomEvent) => {
      // Force re-render when visit state changes
      if (e.detail.key && e.detail.key.startsWith('visit-state-')) {
        setRenderKey(prev => prev + 1)
      }
    }

    // Simple storage event handler - just re-render, don't make API calls
    const handleStorageEvent = (e: StorageEvent) => {
      // If consent form data is updated in another tab, just re-render
      if (e.key && e.key.includes('consentFormsStatus-')) {
        console.log('Dashboard: Consent form updated in another tab, re-rendering...')
        setRenderKey(prev => prev + 1)
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('localStorageChange', handleLocalStorageChange as EventListener)
    window.addEventListener('storage', handleStorageEvent)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('localStorageChange', handleLocalStorageChange as EventListener)
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, []) // Remove fetchVisits dependency to prevent infinite loops

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
          <div className="flex justify-between items-center">
            <h3 className="text-lg sm:text-xl font-medium mb-0" style={{ color: '#1b1b1b' }}>
              {getSectionTitle()}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => fetchVisits(true)}
                disabled={isLoadingVisits}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoadingVisits ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={async () => {
                  console.log('Debug info:', {
                    currentUser: currentUser?.username,
                    preferredUsername: currentUser?.idTokenClaims?.preferred_username,
                    hasLoadedOnce,
                    transformedVisits: transformedVisits.length,
                    visitsToday: visitsToday.length,
                    currentVisits: currentVisits.length,
                    isLoadingVisits,
                    apiError,
                    userExists: !!currentUser
                  })
                  
                  // Test API call directly
                  if (currentUser) {
                    const userEmail = currentUser.username || currentUser.idTokenClaims?.preferred_username
                    if (userEmail) {
                      try {
                        console.log('Testing direct API call for:', userEmail)
                        const testData = await getVisits(userEmail)
                        console.log('Direct API test result:', testData)
                      } catch (error) {
                        console.error('Direct API test error:', error)
                      }
                    } else {
                      console.log('No user email found for API test')
                    }
                  } else {
                    console.log('No current user for API test')
                  }
                }}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Debug
              </button>
            </div>
          </div>
          {isLoadingVisits && (
            <p className="text-sm text-gray-500 mt-2">Loading visits from API...</p>
          )}
          {apiError && (
            <p className="text-sm text-red-600 mt-2">Error loading visits: {apiError}</p>
          )}
          {!isLoadingVisits && !apiError && transformedVisits.length === 0 && (
            <p className="text-sm text-yellow-600 mt-2">No visits data loaded. Try clicking Refresh or Debug to see what's happening.</p>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6 w-full visits-section-container" style={{ maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          {!currentUser ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center">
              <p className="text-gray-600">Waiting for authentication...</p>
            </div>
          ) : activeTab === 'week' ? (
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
