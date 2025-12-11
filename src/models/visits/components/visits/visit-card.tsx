import { useState, useEffect } from 'react'
import { Clock, MapPin, Building, Phone, Check, X, Link } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/data/routing/routes'
import { StatusBadge, VisitTypeBadge } from './visit-badge'
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

  const handleVisitClick = () => {
    navigate(ROUTES.app.visitDetails.href.replace(':visitId', visit.id), { state: { visit } })
  }

  // Get visit state from local storage (shared across tabs)
  const visitState = (() => {
    try {
      const stored = localStorage.getItem(`visit-state-${visit.id}`)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()

  const getActionButton = () => {
    // Get the actual visit status from session storage (same logic as StatusBadge)
    let displayStatus = visit.status // Default to original status
    if (visitState?.status) {
      displayStatus = visitState.status
    }

    // Check consent forms completion status - make it reactive to localStorage changes
    const [consentStatus, setConsentStatus] = useState(() => {
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
    })

    // Listen for localStorage changes and update consent status
    useEffect(() => {
      const updateConsentStatus = () => {
        try {
          const consentData = localStorage.getItem(`consentFormsStatus-${visit.id}`)
          if (consentData) {
            const consent = JSON.parse(consentData)
            const newStatus = {
              hipaa: consent.hipaa === true,
              privacy: consent.privacy === true,
              treatment: consent.treatment === true
            }
            setConsentStatus(newStatus)
          }
        } catch (error) {
          console.error('Error reading consent status:', error)
        }
      }

      // Check once when component mounts or visit.id changes
      updateConsentStatus()
    }, [visit.id])

    const completedCount = Object.values(consentStatus).filter(Boolean).length
    const areAllConsentFormsCompleted = completedCount === 3
    const hasOneOrTwoConsentsCompleted = completedCount === 1 || completedCount === 2
    const hasNoConsentsCompleted = completedCount === 0
    const hasTreatmentConsent = consentStatus.treatment === true
    // Only Treatment Consent is collected (no other consents)
    const onlyTreatmentConsentCollected = hasTreatmentConsent && !consentStatus.hipaa && !consentStatus.privacy
    // HIPAA and Privacy collected but Treatment Consent missing
    const hipaaAndPrivacyCollectedButTreatmentMissing = consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment

    // Function to copy consent link
    const handleCopyConsentLink = () => {
      // Store visit data for later use when user submits consent form
      sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
      sessionStorage.setItem('currentVisitId', visit.id)

      // Determine base URL based on environment
      const getBaseUrl = () => {
        const hostname = window.location.hostname
        const protocol = window.location.protocol
        const port = window.location.port

        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return `${protocol}//${hostname}${port ? `:${port}` : ''}`
        }

        // QA environment (you can adjust this pattern based on your QA URL)
        if (hostname.includes('qa') || hostname.includes('staging') || hostname.includes('dev')) {
          return `${protocol}//${hostname}`
        }

        // Production environment
        return `${protocol}//${hostname}`
      }

      const baseUrl = getBaseUrl()
      const consentLink = `${baseUrl}${ROUTES.app.consentForms.href}?visitId=${visit.id}`

      navigator.clipboard.writeText(consentLink).then(() => {
        // Change button state to show success
        setIsLinkCopied(true)
        console.log('Consent link copied to clipboard:', consentLink)

        // Reset button state after 2 seconds
        setTimeout(() => {
          setIsLinkCopied(false)
        }, 2000)
      }).catch(() => {
        console.error('Failed to copy consent link')
        // Could show error state here if needed
      })
    }



    // Button logic based on badge status
    if (displayStatus === 'completed') {
      // Check if HIPAA or Privacy are missing
      const hipaaOrPrivacyMissing = !consentStatus.hipaa || !consentStatus.privacy

      if (hipaaOrPrivacyMissing) {
        // Show View Summary + additional consent button
        if (visit.visitType === 'in-home') {
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none text-sm leading-7 min-w-16 font-medium transition-all duration-250 ease-out"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  color: 'rgb(85, 56, 166)',
                  backgroundColor: 'transparent',
                  minHeight: '44px',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '5px 15px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgb(85, 56, 166)',
                  borderRadius: '12px',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%'
                }}
              >
                View Summary
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('fromConsentPage', 'true')
                  sessionStorage.setItem('currentVisitId', visit.id)
                  sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                  window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
                }}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(228, 118, 0)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Collect Consent
              </button>
            </div>
          )
        } else {
          // Telehealth
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none text-sm leading-7 min-w-16 font-medium transition-all duration-250 ease-out"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  color: 'rgb(85, 56, 166)',
                  backgroundColor: 'transparent',
                  minHeight: '44px',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '5px 15px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgb(85, 56, 166)',
                  borderRadius: '12px',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  width: '100%'
                }}
              >
                View Summary
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
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

      // All consents collected - show only View Summary
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none text-sm leading-7 min-w-16 font-medium transition-all duration-250 ease-out"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            color: 'rgb(85, 56, 166)',
            backgroundColor: 'transparent',
            minHeight: '44px',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '5px 15px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgb(85, 56, 166)',
            borderRadius: '12px',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          View Summary
        </button>
      )
    } else if (displayStatus === 'ready-to-save') {
      // Check if HIPAA or Privacy are missing
      const hipaaOrPrivacyMissing = !consentStatus.hipaa || !consentStatus.privacy

      if (hipaaOrPrivacyMissing) {
        // Show Save + additional consent button
        if (visit.visitType === 'in-home') {
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '120px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('fromConsentPage', 'true')
                  sessionStorage.setItem('currentVisitId', visit.id)
                  sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                  window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
                }}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(228, 118, 0)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Collect Consent
              </button>
            </div>
          )
        } else {
          // Telehealth
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '120px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
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

      // All consents collected - show only Save button
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '120px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '48px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px'
          }}
        >
          Save
        </button>
      )
    } else if (displayStatus === 'in-progress') {
      // In-progress status → Continue button
      // Check if HIPAA or Privacy are missing
      const hipaaOrPrivacyMissing = !consentStatus.hipaa || !consentStatus.privacy

      if (hipaaOrPrivacyMissing) {
        // Show Continue + additional consent button
        if (visit.visitType === 'in-home') {
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Continue
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('fromConsentPage', 'true')
                  sessionStorage.setItem('currentVisitId', visit.id)
                  sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                  window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
                }}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(228, 118, 0)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Collect Consent
              </button>
            </div>
          )
        } else {
          // Telehealth
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Continue
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
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

      // All consents collected - show only Continue
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '48px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px'
          }}
        >
          Continue
        </button>
      )
    } else if (areAllConsentFormsCompleted) {
      // All consent forms completed → Log Outcomes button
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '44px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '6px 16px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px'
          }}
        >
          Log Outcomes
        </button>
      )
    } else if (hipaaAndPrivacyCollectedButTreatmentMissing && visit.visitType === 'in-home') {
      // HIPAA + Privacy collected (Treatment missing) → Show only Collect Consent button (In-Home only)
      return (
        <button
          onClick={() => {
            sessionStorage.setItem('fromConsentPage', 'true')
            sessionStorage.setItem('currentVisitId', visit.id)
            // Store visit data for later use
            sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
            window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
          }}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '48px',
            backgroundColor: 'rgb(228, 118, 0)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px'
          }}
        >
          Collect Consent
        </button>
      )
    } else if (onlyTreatmentConsentCollected && visit.visitType === 'in-home') {
      // Only Treatment Consent collected → Show both Log Outcomes and Collect Consent buttons (In-Home only)
      return (
        <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
          <button
            onClick={handleVisitClick}
            className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              appearance: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              minWidth: '64px',
              textTransform: 'none',
              fontWeight: '500',
              boxShadow: 'none',
              minHeight: '48px',
              backgroundColor: 'rgb(85, 56, 166)',
              color: 'rgb(255, 255, 255)',
              outline: '0px',
              margin: '0px',
              textDecoration: 'none',
              padding: '10px 24px',
              borderWidth: '0px',
              borderStyle: 'initial',
              borderColor: 'initial',
              borderImage: 'initial',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '12px',
              width: '100%'
            }}
          >
            Log Outcomes
          </button>
          <button
            onClick={() => {
              sessionStorage.setItem('fromConsentPage', 'true')
              sessionStorage.setItem('currentVisitId', visit.id)
              // Store visit data for later use
              sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
              window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
            }}
            className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              appearance: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              minWidth: '64px',
              textTransform: 'none',
              fontWeight: '500',
              boxShadow: 'none',
              minHeight: '48px',
              backgroundColor: 'rgb(228, 118, 0)',
              color: 'rgb(255, 255, 255)',
              outline: '0px',
              margin: '0px',
              textDecoration: 'none',
              padding: '10px 24px',
              borderWidth: '0px',
              borderStyle: 'initial',
              borderColor: 'initial',
              borderImage: 'initial',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '12px',
              width: '100%'
            }}
          >
            Collect Consent
          </button>
        </div>
      )
    } else if (hasOneOrTwoConsentsCompleted) {
      // 1 or 2 consents completed → Different buttons based on visit type and which consents are collected
      if (visit.visitType === 'telehealth') {
        // Telehealth: Check specific consent combinations

        // Only Treatment Consent collected → Show both Log Outcomes and Copy Consent Link buttons
        if (consentStatus.treatment && !consentStatus.hipaa && !consentStatus.privacy) {
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
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

        // HIPAA + Privacy collected (Treatment missing) → Show only Copy Consent Link button
        if (consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment) {
          // HIPAA + Privacy collected, Treatment missing → Show only Copy Consent Link button
          return (
            <div className="flex flex-col gap-1" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
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

        // Only HIPAA OR only Privacy collected (Treatment missing) → Show only Copy Consent Link button
        if ((consentStatus.hipaa && !consentStatus.privacy && !consentStatus.treatment) ||
          (!consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment)) {
          return (
            <div className="flex flex-col gap-1" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
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

        // Treatment + HIPAA OR Treatment + Privacy (but not both) → Show both Log Outcomes and Copy Consent Link buttons
        if (consentStatus.treatment && ((consentStatus.hipaa && !consentStatus.privacy) || (!consentStatus.hipaa && consentStatus.privacy))) {
          // Treatment collected with one of HIPAA or Privacy → Show both Log Outcomes and Copy Consent Link buttons
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
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
        } else {
          // Fallback for other combinations → Show both buttons (original behavior)
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
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
      } else if (visit.visitType === 'in-home') {
        // In-home: Check specific consent combinations

        // Only Treatment Consent collected → Show both Log Outcomes and Collect Consent buttons
        if (consentStatus.treatment && !consentStatus.hipaa && !consentStatus.privacy) {
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('fromConsentPage', 'true')
                  sessionStorage.setItem('currentVisitId', visit.id)
                  sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                  window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
                }}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(228, 118, 0)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Collect Consent
              </button>
            </div>
          )
        }

        // HIPAA + Privacy collected (Treatment missing) → Show only Collect Consent button
        if (consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment) {
          // HIPAA + Privacy collected, Treatment missing → Show only Collect Consent button
          return (
            <button
              onClick={() => {
                sessionStorage.setItem('fromConsentPage', 'true')
                sessionStorage.setItem('currentVisitId', visit.id)
                // Store visit data for later use
                sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
              }}
              className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxSizing: 'border-box',
                cursor: 'pointer',
                userSelect: 'none',
                verticalAlign: 'middle',
                appearance: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minWidth: '64px',
                textTransform: 'none',
                fontWeight: '500',
                boxShadow: 'none',
                minHeight: '48px',
                backgroundColor: 'rgb(228, 118, 0)',
                color: 'rgb(255, 255, 255)',
                outline: '0px',
                margin: '0px',
                textDecoration: 'none',
                padding: '10px 24px',
                borderWidth: '0px',
                borderStyle: 'initial',
                borderColor: 'initial',
                borderImage: 'initial',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '12px'
              }}
            >
              Collect Consent
            </button>
          )
        }

        // Only HIPAA OR only Privacy collected (Treatment missing) → Show only Collect Consent button
        if ((consentStatus.hipaa && !consentStatus.privacy && !consentStatus.treatment) ||
          (!consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment)) {
          return (
            <button
              onClick={() => {
                sessionStorage.setItem('fromConsentPage', 'true')
                sessionStorage.setItem('currentVisitId', visit.id)
                sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
              }}
              className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxSizing: 'border-box',
                cursor: 'pointer',
                userSelect: 'none',
                verticalAlign: 'middle',
                appearance: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minWidth: '64px',
                textTransform: 'none',
                fontWeight: '500',
                boxShadow: 'none',
                minHeight: '48px',
                backgroundColor: 'rgb(228, 118, 0)',
                color: 'rgb(255, 255, 255)',
                outline: '0px',
                margin: '0px',
                textDecoration: 'none',
                padding: '10px 24px',
                borderWidth: '0px',
                borderStyle: 'initial',
                borderColor: 'initial',
                borderImage: 'initial',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '12px'
              }}
            >
              Collect Consent
            </button>
          )
        }

        // Treatment + HIPAA OR Treatment + Privacy (but not both) → Show both Log Outcomes and Collect Consent buttons
        if (consentStatus.treatment && ((consentStatus.hipaa && !consentStatus.privacy) || (!consentStatus.hipaa && consentStatus.privacy))) {
          // Treatment + HIPAA OR Treatment + Privacy (but not both) → Show both Log Outcomes and Collect Consent buttons
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('fromConsentPage', 'true')
                  sessionStorage.setItem('currentVisitId', visit.id)
                  // Store visit data for later use
                  sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                  window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
                }}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(228, 118, 0)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Collect Consent
              </button>
            </div>
          )
        }
      }

      // Fallback
      return null
    } else {
      // For telehealth visits with no consents completed, show Copy Consent Link button
      if (visit.visitType === 'telehealth' && hasNoConsentsCompleted) {
        return (
          <div className="flex flex-col gap-1" style={{ alignItems: 'flex-end' }}>
            <button
              onClick={handleCopyConsentLink}
              className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxSizing: 'border-box',
                cursor: 'pointer',
                userSelect: 'none',
                verticalAlign: 'middle',
                appearance: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minWidth: '64px',
                textTransform: 'none',
                fontWeight: '500',
                boxShadow: 'none',
                minHeight: '48px',
                backgroundColor: 'rgb(85, 56, 166)',
                color: 'rgb(255, 255, 255)',
                outline: '0px',
                margin: '0px',
                textDecoration: 'none',
                padding: '10px 24px',
                borderWidth: '0px',
                borderStyle: 'initial',
                borderColor: 'initial',
                borderImage: 'initial',
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

      // For in-home visits with no consents completed, show Collect Consent button
      if (visit.visitType === 'in-home' && hasNoConsentsCompleted) {
        return (
          <button
            onClick={() => {
              sessionStorage.setItem('fromConsentPage', 'true')
              sessionStorage.setItem('currentVisitId', visit.id)
              // Store visit data for later use
              sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
              window.open(ROUTES.app.consentForms.href, '_blank')
            }}
            className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              appearance: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              minWidth: '64px',
              textTransform: 'none',
              fontWeight: '500',
              boxShadow: 'none',
              minHeight: '44px',
              backgroundColor: 'rgb(228, 118, 0)',
              color: 'rgb(255, 255, 255)',
              outline: '0px',
              margin: '0px',
              textDecoration: 'none',
              padding: '6px 16px',
              borderWidth: '0px',
              borderStyle: 'initial',
              borderColor: 'initial',
              borderImage: 'initial',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '12px'
            }}
          >
            Collect Consent
          </button>
        )
      }

      // Fallback for any other cases
      return null
    }
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
        // style={{
        //   height: '32px',
        //   minHeight: '32px',
        // }}
        >
          <span className="text-xs">Not Started</span>
        </div>
      )
    }
  }

  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col visit-card-content" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        <div className="space-y-4 sm:space-y-5">
          {/* Header Row */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                <h3 className="text-base sm:text-lg font-medium truncate" style={{ color: '#1b1b1b' }}>
                  {visit.patientName}
                </h3>
                <div className="flex-shrink-0">
                  <StatusBadge status={visit.status} visitState={visitState} />
                </div>
              </div>
              <div className="w-full sm:w-auto sm:flex-shrink-0">{getActionButton()}</div>
            </div>
          </div>



          {/* Visit Details - Responsive Flex Layout */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm visit-details-mobile" style={{ color: '#939090', maxWidth: '100%', overflow: 'hidden' }}>
            {/* Time */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{visit.time}</span>
            </div>

            {/* Address - show for all visits */}
            {visit.address && (
              <div className="flex items-start gap-1 min-w-0 max-w-full sm:max-w-xs">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{visit.address}</span>
              </div>
            )}

            {/* Phone Number */}
            {visit.phone && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">{visit.phone}</span>
              </div>
            )}

            {/* Insurance */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Building className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{visit.insurance}</span>
            </div>
          </div>

          {/* Second Telehealth Button (below time for telehealth visits) */}
          {visit.visitType === 'telehealth' && (
            <div className="flex justify-start">
              <div
                className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border"
                style={{
                  color: '#239BCF',
                  borderColor: '#239BCF',
                }}
              >
                <VideocamIcon className="w-3 h-3" />
                <span>Telehealth</span>
              </div>
            </div>
          )}

          {/* Visit Type */}
          <VisitTypeBadge visitType={visit.visitType} />

          {/* First Separator Line */}
          <div className="border-t border-gray-200"></div>

          {/* Consent Forms */}
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <h4 className="text-xs font-medium text-gray-700 mb-2 sm:mb-3 tracking-wide">
              Consent Forms:
            </h4>
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
                          <span className="text-xs font-medium" style={{ color: 'rgb(207, 35, 35)', height: '24px' }}>Missing</span>
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
          <div className="border-t border-gray-200"></div>

          {/* Procedures */}
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <h4 className="text-xs font-medium text-gray-700 mb-2 sm:mb-3 tracking-wide">
              Required Procedures
            </h4>
            <div className="flex flex-wrap gap-2 procedures-mobile" style={{ maxWidth: '100%' }}>
              {visit.procedures
                .filter((p) => {
                  // Map procedure names to IDs used in visit details
                  const procedureIdMap: Record<string, string> = {
                    'A1C': 'a1c',
                    'HbA1c Test': 'a1c', // Map HbA1c Test to same ID as A1C
                    'Blood Pressure': 'blood-pressure',
                    'Urine Sample': 'urine-sample',
                    'Lipid Panel': 'lipid-panel' // Add Lipid Panel mapping
                  }
                  const procedureId = procedureIdMap[p.name] || p.name.toLowerCase().replace(/\s+/g, '-')
                  // Hide only if procedure came from backend as completed (p.completed === true)
                  // If user manually marked as completed, keep showing it
                  const isBackendCompleted = p.completed === true
                  // Hide if backend says completed, but show if user manually completed
                  return !isBackendCompleted
                })
                .map((p, i) => {
                // Map procedure names to IDs used in visit details
                const procedureIdMap: Record<string, string> = {
                  'A1C': 'a1c',
                  'HbA1c Test': 'a1c', // Map HbA1c Test to same ID as A1C
                  'Blood Pressure': 'blood-pressure',
                  'Urine Sample': 'urine-sample',
                  'Lipid Panel': 'lipid-panel' // Add Lipid Panel mapping
                }

                const procedureId = procedureIdMap[p.name] || p.name.toLowerCase().replace(/\s+/g, '-')
                // Determine status: completed, not-completed, or pending (no outcome yet)
                const outcome = visitState?.outcomes?.[procedureId]
                const isCompleted = outcome === 'completed'
                const isNotCompleted = outcome === 'not-completed'

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
                      padding: '0px 12px',
                      borderRadius: '999px'
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
          <div className="border-t border-gray-200"></div>

          {/* Health Risk Assessment */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
              Health Risk Assessment
            </h4>
            {getHRABadge()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

 