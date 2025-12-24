import { useState, useEffect } from 'react'
import { Clock, MapPin, Building, Phone, Check, X, Link, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/data/routing/routes'
import { StatusBadge } from './visit-badge'
import { Visit } from '../../types/types'
import { Card, CardContent } from './ui/Card'

// Video Camera Icon Component (Icons.Outlined.Videocam style)
const VideocamIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z" />
  </svg>
)



export function VisitCard({ visit }: { visit: Visit }) {
  const navigate = useNavigate()
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [visitState, setVisitState] = useState<any>(null)

  const handleVisitClick = () => {
    navigate(ROUTES.app.visitDetails.href.replace(':visitId', visit.id), { state: { visit } })
  }

  // Get visit state from local storage (shared across tabs) - make it reactive
  useEffect(() => {
    const loadVisitState = () => {
      try {
        const stored = localStorage.getItem(`visit-state-${visit.id}`)
        setVisitState(stored ? JSON.parse(stored) : null)
      } catch {
        setVisitState(null)
      }
    }

    // Load initial state
    loadVisitState()

    // Listen for storage changes (when user navigates back from visit details)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `visit-state-${visit.id}`) {
        loadVisitState()
      }
    }

    // Listen for custom events (for same-tab updates)
    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key === `visit-state-${visit.id}`) {
        loadVisitState()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener)
    }
  }, [visit.id])

  // Function to copy consent link
  const handleCopyConsentLink = () => {
    // Store visit data for later use when user submits consent form
    sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
    sessionStorage.setItem('currentVisitId', visit.id)

    // Use consentURL from API response
    const consentLink = visit.consentURL || `${window.location.origin}${ROUTES.app.consentForms.href}?visitId=${visit.id}`

    navigator.clipboard.writeText(consentLink).then(() => {
      // Change button state to show success
      setIsLinkCopied(true)

      // Reset button state after 2 seconds
      setTimeout(() => {
        setIsLinkCopied(false)
      }, 2000)
    }).catch(() => {
      // Could show error state here if needed
    })
  }

  // Helper function to render status-based button
  const renderStatusButton = (status: string) => {
    const buttonStyles = {
      base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative' as const,
        boxSizing: 'border-box' as const,
        cursor: 'pointer',
        userSelect: 'none' as const,
        verticalAlign: 'middle' as const,
        appearance: 'none' as const,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '0.875rem',
        lineHeight: '1.75',
        textTransform: 'none' as const,
        fontWeight: '500',
        boxShadow: 'none',
        outline: '0px',
        margin: '0px',
        textDecoration: 'none' as const,
        transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '12px'
      }
    }

    if (status === 'completed') {
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none text-sm leading-7 min-w-16 font-medium transition-all duration-250 ease-out"
          style={{
            ...buttonStyles.base,
            minWidth: '64px',
            color: 'rgb(85, 56, 166)',
            backgroundColor: 'transparent',
            minHeight: '44px',
            padding: '5px 15px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgb(85, 56, 166)',
            width: '100%'
          }}
        >
          View Summary
        </button>
      )
    } else if (status === 'ready-to-save') {
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            ...buttonStyles.base,
            minWidth: '120px',
            minHeight: '48px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            width: '100%'
          }}
        >
          Save
        </button>
      )
    } else if (status === 'in-progress') {
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            ...buttonStyles.base,
            minWidth: '64px',
            minHeight: '48px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            width: '100%'
          }}
        >
          Continue
        </button>
      )
    } else {
      // Default: Log Outcomes button
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            ...buttonStyles.base,
            minWidth: '64px',
            minHeight: '48px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            width: '100%'
          }}
        >
          Log Outcomes
        </button>
      )
    }
  }

  // Helper function to render consent collection button
  const renderConsentButton = () => {
    if (visit.visitType === 'in-home') {
      return (
        <button
          onClick={() => {
            sessionStorage.setItem('fromConsentPage', 'true')
            sessionStorage.setItem('currentVisitId', visit.id)
            sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
            window.open(visit.consentURL || `${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
          }}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative' as const,
            boxSizing: 'border-box' as const,
            cursor: 'pointer',
            userSelect: 'none' as const,
            verticalAlign: 'middle' as const,
            appearance: 'none' as const,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none' as const,
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '48px',
            backgroundColor: 'rgb(228, 118, 0)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none' as const,
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px',
            width: '100%'
          }}
        >
          Collect Consent
        </button>
      )
    } else {
      // Telehealth
      return (
        <div className="flex flex-col gap-1" style={{ alignItems: 'flex-end' }}>
          <button
            onClick={handleCopyConsentLink}
            className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative' as const,
              boxSizing: 'border-box' as const,
              cursor: 'pointer',
              userSelect: 'none' as const,
              verticalAlign: 'middle' as const,
              appearance: 'none' as const,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              minWidth: '64px',
              textTransform: 'none' as const,
              fontWeight: '500',
              boxShadow: 'none',
              minHeight: '48px',
              backgroundColor: 'rgb(85, 56, 166)',
              color: 'rgb(255, 255, 255)',
              outline: '0px',
              margin: '0px',
              textDecoration: 'none' as const,
              padding: '10px 24px',
              borderWidth: '0px',
              borderStyle: 'initial',
              borderColor: 'initial',
              borderRadius: '12px',
              width: '100%',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {isLinkCopied ? 'Link Copied!' : 'Copy Consent Link'}
            <Link className="w-4 h-4" />
          </button>
          <p className="text-xs text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', marginTop: '2px' }}>
            Copies link to paste in Telehealth chat
          </p>
        </div>
      )
    }
  }

  const getActionButton = () => {
    // Get the actual visit status from session storage (same logic as StatusBadge)
    let displayStatus = visit.status // Default to original status
    if (visitState?.status) {
      displayStatus = visitState.status
    }

    // Check consent forms completion status - read fresh from localStorage each render
    const consentStatus = (() => {
      try {
        const consentData = localStorage.getItem(`consentFormsStatus-${visit.id}`)
        if (consentData) {
          const consent = JSON.parse(consentData)
          return {
            hipaa: consent.hipaa === true,
            privacy: consent.privacy === true,
            treatment: consent.treatment === true
          }
        }
      } catch {
        return {
          hipaa: false,
          privacy: false,
          treatment: false
        }
      }
      return {
        hipaa: false,
        privacy: false,
        treatment: false
      }
    })()

    const completedCount = Object.values(consentStatus).filter(Boolean).length
    const areAllConsentFormsCompleted = completedCount === 3
    const hasOneOrTwoConsentsMissing = completedCount === 1 || completedCount === 2
    const hasNoConsentsCompleted = completedCount === 0

    // New Simplified Logic:
    // 1. When all 3 consents are true ? Show only status-based button
    // 2. When 1-2 consents are missing ? Show status-based button + consent collection button
    // 3. When no consents ? Show only consent collection button

    // Case 1: All 3 consents are true ? Show only status-based button
    if (areAllConsentFormsCompleted) {
      return renderStatusButton(displayStatus)
    }

    // Case 2: 1-2 consents are missing ? Show status-based button + consent collection button
    if (hasOneOrTwoConsentsMissing) {
      return (
        <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
          {renderStatusButton(displayStatus)}
          {renderConsentButton()}
        </div>
      )
    }

    // Case 3: No consents ? Show status-based button + consent collection button
    if (hasNoConsentsCompleted) {
      return (
        <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
          {renderStatusButton(displayStatus)}
          {renderConsentButton()}
        </div>
      )
    }

    // Fallback (should not reach here)
    return null
  }

  const getHRABadge = () => {
    // Check localStorage for HRA completion
    const hraCompleted = visitState?.outcomes?.['hra'] === 'completed'
    const hraNotCompleted = visitState?.outcomes?.['hra'] === 'not-completed'

    // Determine HRA status based on localStorage and original status
    let hraStatus = visit.healthRiskAssessment

    if (hraCompleted || hraNotCompleted) {
      // If HRA is completed/not-completed in visit details but visit is not saved yet, show in-progress
      const visitCompleted = visitState?.status === 'completed'
      hraStatus = visitCompleted ? 'completed' : 'in-progress'
    }

    if (hraStatus === 'completed') {
      return (
        <div
          className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
          style={{
            maxWidth: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.5',
            cursor: 'unset',
            verticalAlign: 'middle',
            boxSizing: 'border-box',
            height: '26px',
            fontWeight: '500',
            fontSize: '0.75rem',
            backgroundColor: 'rgb(25, 154, 146)',
            color: 'rgb(255, 255, 255)',
            whiteSpace: 'nowrap',
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            outline: '0px',
            textDecoration: 'none',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            padding: '0px 12px',
            borderRadius: '999px'
          }}
        >
          <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Check className="w-2 h-2" style={{ color: 'rgb(25, 154, 146)' }} />
          </div>
          <span className="text-xs">Completed</span>
        </div>
      )
    } else if (hraStatus === 'in-progress') {
      return (
        <div
          className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
          style={{
            maxWidth: '100%',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: '1.5',
            cursor: 'unset',
            verticalAlign: 'middle',
            boxSizing: 'border-box',
            height: '24px',
            fontWeight: '500',
            fontSize: '0.75rem',
            backgroundColor: 'rgb(228, 118, 0)',
            color: 'rgb(255, 255, 255)',
            whiteSpace: 'nowrap',
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            outline: '0px',
            textDecoration: 'none',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            padding: '0px 12px',
            borderRadius: '999px'
          }}
        >
          {/* Clipboard icon */}
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7,9V11H17V9H7M7,13V15H14V13H7Z" />
          </svg>
          <span className="text-xs">In Progress</span>
        </div>
      )
    } else {
      return (
        <div
          className="bg-red-500 text-white px-3 sm:px-4 rounded-full text-xs font-medium inline-flex items-center gap-1 whitespace-nowrap"
        >
          <span className="text-xs">Not Started</span>
        </div>
      )
    }
  }

  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <CardContent className="p-2 sm:p-3 h-full flex flex-col visit-card-content" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="flex justify-between items-start">
          {/* Left side - Name, Status Badge and Visit Details in one container */}
          <div className="flex flex-col items-start">
            {/* Name and Status Badge */}
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-base sm:text-lg font-medium" style={{ color: '#1b1b1b' }}>
                {visit.patientName}
              </h3>
              <StatusBadge status={visit.status} visitState={visitState} />
            </div>

            {/* Visit Details - Vertical Layout */}
            <div className="space-y-1">
              {/* Address */}
              {visit.address && (
                <div className="flex items-start gap-2 text-sm py-1" style={{ color: '#939090' }}>
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{visit.address}</span>
                </div>
              )}

              {/* Phone Number */}
              <div className="flex items-center gap-2 text-sm py-1" style={{ color: '#939090' }}>
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{visit.phone || 'N/A'}</span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-sm py-1" style={{ color: '#939090' }}>
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{visit.time}</span>
              </div>

              {/* Insurance/Payer */}
              <div className="flex items-center gap-2 text-sm py-1" style={{ color: '#939090' }}>
                <Building className="w-4 h-4 flex-shrink-0" />
                <span>{visit.insurance}</span>
              </div>

              {/* Visit Type Badge */}
              <div className="flex items-center gap-2 text-sm mt-3">
                {visit.visitType === 'telehealth' ? (
                  <div
                    className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                    style={{
                      color: '#239BCF',
                    }}
                  >
                    <VideocamIcon className="w-3 h-3" />
                    <span>Telehealth</span>
                  </div>
                ) : (
                  <div
                    className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1"
                    style={{
                      color: '#5538A6',
                    }}
                  >
                    <Home className="w-3 h-3" />
                    <span>In-Home Visit</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex-shrink-0">
            {getActionButton()}
          </div>
        </div>

        {/* First Separator Line */}
        <div className="border-t border-gray-200 mt-3"></div>

        {/* Consent Forms */}
        <div className="py-2" style={{ maxWidth: '100%', overflow: 'hidden' }}>
          <h4 className="text-xs font-medium text-gray-700 mb-2 tracking-wide">Consent Forms:</h4>
            <div className="flex flex-wrap gap-6 items-start" style={{ maxWidth: '100%' }}>
              {(() => {
                // Read consent record once to decide whether to show statuses
                let consentRecord: any | null = null
                let showStatuses = false
                try {
                  const consentDataRaw = localStorage.getItem(`consentFormsStatus-${visit.id}`)
                  if (consentDataRaw) {
                    consentRecord = JSON.parse(consentDataRaw)
                    showStatuses = consentRecord?.submitted === true
                  }
                } catch { }

                return visit.consentForms.map((cf, i) => {
                  // Determine completion only if we have a record
                  const isCompleted = (() => {
                    if (!consentRecord) return false
                    if (cf.name === 'HIPAA Authorization') return consentRecord.hipaa === true
                    if (cf.name === 'Notice of Privacy Practices') return consentRecord.privacy === true
                    if (cf.name === 'Treatment Consent') return consentRecord.treatment === true
                    return false
                  })()

                  return (
                    <div key={i} className="flex flex-col gap-1">
                      {showStatuses ? (
                        isCompleted ? (
                          <div
                            className="inline-flex items-center text-white text-xs font-medium"
                            style={{
                              backgroundColor: 'rgb(25, 154, 146)',
                              height: '26px',
                              borderRadius: '9999px',
                              padding: '0 8px',
                              gap: '6px',
                              minWidth: 'fit-content',
                              maxWidth: '100%',
                              justifyContent: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <span
                              className="inline-flex items-center justify-center"
                              style={{
                                width: '20px',
                                height: '10px',
                                borderRadius: '9999px',
                                backgroundColor: '#FFFFFF'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 16 16" fill="none">
                                <path d="M6.5 11.3L3.5 8.3L4.55 7.25L6.5 9.2L11.45 4.25L12.5 5.3L6.5 11.3Z" fill="#199A92" />
                              </svg>
                            </span>
                            <span>Collected</span>
                          </div>
                        ) : (
                          <div
                            className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
                            style={{
                              maxWidth: '100%',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: '1.5',
                              cursor: 'unset',
                              verticalAlign: 'middle',
                              boxSizing: 'border-box',
                              height: '26px',
                              fontWeight: '500',
                              fontSize: '0.75rem',
                              backgroundColor: 'rgb(207, 35, 35)',
                              color: 'rgb(255, 255, 255)',
                              whiteSpace: 'nowrap',
                              transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                              outline: '0px',
                              textDecoration: 'none',
                              borderWidth: '0px',
                              borderStyle: 'initial',
                              borderColor: 'initial',
                              borderImage: 'initial',
                              padding: '0px 12px',
                              borderRadius: '9999px',
                              minWidth: 'fit-content',
                              width: 'auto'
                            }}
                          >
                            <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                              <X className="w-2 h-2" style={{ color: 'rgb(207, 35, 35)' }} />
                            </div>
                            <span>Missing</span>
                          </div>
                        )
                      ) : null}
                      <span style={{
                        fontSize: '0.875rem',
                        lineHeight: '1.4',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: showStatuses ? '#1B1B1B' : 'rgb(228, 118, 0)',
                        fontWeight: 500
                      }}>
                        {cf.name}
                      </span>
                    </div>
                  )
                })
              })()}
            </div>
        </div>

        {/* Second Separator Line */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Procedures */}
        <div className="py-2" style={{ maxWidth: '100%', overflow: 'hidden' }}>
          <h4 className="text-xs font-medium text-gray-700 mb-2 tracking-wide">Required Procedures</h4>
          <div className="flex flex-wrap gap-2 procedures-mobile" style={{ maxWidth: '100%' }}>
            {visit.procedures.map((p, i) => {
              // Try multiple possible procedure ID formats to find a match (same as useVisitState)
              const possibleIds = [
                // First try exact name match (most common)
                p.name.toLowerCase().replace(/\s+/g, '-'),
                // Then try gap format
                `gap-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
                // Then try common abbreviations
                p.name.toLowerCase().replace(/[^a-z0-9]/g, ''), // Remove all non-alphanumeric
                // Then try first word only
                p.name.split(' ')[0].toLowerCase(),
                // Then try last word only  
                p.name.split(' ').pop()?.toLowerCase() || '',
              ]

              // Special mappings for common procedure names (based on API response)
              const specialMappings: Record<string, string> = {
                // Lab mappings (Mapped_Lab_Term -> PSC_Lab_Type__c.toLowerCase())
                'GFR, UACR': 'ked', // KED lab
                'A1C': 'a1c',
                'HbA1c': 'hba1c',
                'Lipid Panel': 'lipid-panel',
                // Gap mappings (Mapped_Gap_Term -> gap-PSC_Measure__c.toLowerCase())
                'Fundospopic Imaging': 'gap-eed', // EED gap
                // Fallback mappings
                'Blood Pressure': 'blood-pressure',
                'Urine Sample': 'urine-sample'
              }

              // Find the first matching outcome
              let outcome = null
              // First try the exact procedureId if available (most reliable)
              if (p.procedureId && visitState?.outcomes?.[p.procedureId]) {
                outcome = visitState.outcomes[p.procedureId]
              } else {
                // Fallback to trying multiple possible IDs
                for (const id of possibleIds) {
                  if (visitState?.outcomes?.[id]) {
                    outcome = visitState.outcomes[id]
                    break
                  }
                }
                // Try special mappings if no match found
                if (!outcome) {
                  const specialId = specialMappings[p.name]
                  if (specialId && visitState?.outcomes?.[specialId]) {
                    outcome = visitState.outcomes[specialId]
                  }
                }
              }

              // Determine status: completed, not-completed, or pending (no outcome yet)
              const isBackendCompleted = p.completed === true
              const isCompleted = isBackendCompleted || outcome === 'completed'
              const isNotCompleted = !isBackendCompleted && outcome === 'not-completed'

              // Debug logging (remove in production)
              if (visitState?.outcomes && Object.keys(visitState.outcomes).length > 0) {
                console.log(`Visit Card - Procedure: "${p.name}", ProcedureId: "${p.procedureId}", Outcome: "${outcome}", Backend: ${isBackendCompleted}`)
                console.log(`Visit Card - Available outcomes:`, visitState.outcomes)
                console.log(`Visit Card - Final status: completed=${isCompleted}, not-completed=${isNotCompleted}`)
              }

              return (
                <div
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
                  style={{
                    maxWidth: '100%',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.5',
                    cursor: 'unset',
                    verticalAlign: 'middle',
                    boxSizing: 'border-box',
                    height: '26px',
                    fontWeight: '500',
                    fontSize: '0.75rem',
                    backgroundColor: isCompleted ? 'rgb(25, 154, 146)' : (isNotCompleted ? 'rgb(207, 35, 35)' : 'white'),
                    color: isCompleted || isNotCompleted ? 'rgb(255, 255, 255)' : '#1B1B1B',
                    whiteSpace: 'nowrap',
                    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                    outline: '0px',
                    textDecoration: 'none',
                    border: isCompleted || isNotCompleted ? '0px' : '1px solid rgb(229, 231, 235)',
                    padding: '0px 8px',
                    borderRadius: '9999px'
                  }}
                >
                {isCompleted ? (
                  <>
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3" style={{ color: 'rgb(25, 154, 146)' }} />
                    </div>
                    <span>{p.name}</span>
                  </>
                ) : isNotCompleted ? (
                  <>
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3" style={{ color: 'rgb(207, 35, 35)' }} />
                    </div>
                    <span>{p.name}</span>
                  </>
                ) : (
                  <>
                    <span>{p.name}</span>
                  </>
                )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Third Separator Line */}
        <div className="border-t border-gray-200 my-2"></div>

        {/* Health Risk Assessment */}
        <div className="py-2">
          <h4 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Health Risk Assessment</h4>
          {getHRABadge()}
        </div>
      </CardContent>
    </Card>
  )
}
