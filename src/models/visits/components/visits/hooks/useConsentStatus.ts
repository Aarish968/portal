import { useState, useCallback, useEffect } from 'react'
import { PendingConsentData } from '../types'

export function useConsentStatus(refreshVisitStates: () => void, setTime: (time: string) => void) {
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showConsentConfirmation, setShowConsentConfirmation] = useState(false)
  const [pendingConsentData, setPendingConsentData] = useState<PendingConsentData | null>(null)
  const [showConsentLoading, setShowConsentLoading] = useState(false)
  const [showConsentSuccess, setShowConsentSuccess] = useState(false)

  const handleConsentConfirmation = useCallback(() => {
    setShowConsentConfirmation(false)

    const consentStatus = pendingConsentData?.consentStatus
    const allThreeMissing = !consentStatus?.hipaa && !consentStatus?.privacy && !consentStatus?.treatment

    if (allThreeMissing) {
      setShowConsentModal(true)
    } else {
      setShowConsentLoading(true)

      setTimeout(() => {
        setShowConsentLoading(false)
        setShowConsentSuccess(true)

        refreshVisitStates()
        setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))

        setTimeout(() => {
          setShowConsentSuccess(false)
          setPendingConsentData(null)
        }, 1000)
      }, 2000)
    }
  }, [pendingConsentData, refreshVisitStates, setTime])

  const checkConsentStatus = useCallback(() => {
    try {
      const visitId = sessionStorage.getItem('currentVisitId')
      if (!visitId) {
        const consentData = localStorage.getItem('consentFormsStatus')
        if (consentData) {
          const consent = JSON.parse(consentData)
          const completedCount = [consent.hipaa, consent.privacy, consent.treatment].filter(Boolean).length
          if (completedCount === 0) {
            setPendingConsentData({
              visitId: null,
              consentStatus: consent
            })
            setShowConsentConfirmation(true)
          }
        } else {
          setPendingConsentData({
            visitId: null,
            consentStatus: { hipaa: false, privacy: false, treatment: false }
          })
          setShowConsentConfirmation(true)
        }
      } else {
        const consentData = localStorage.getItem(`consentFormsStatus-${visitId}`)
        if (consentData) {
          const consent = JSON.parse(consentData)
          const completedCount = [consent.hipaa, consent.privacy, consent.treatment].filter(Boolean).length
          if (completedCount === 0) {
            setPendingConsentData({
              visitId,
              consentStatus: consent
            })
            setShowConsentConfirmation(true)
          }
        } else {
          setPendingConsentData({
            visitId,
            consentStatus: { hipaa: false, privacy: false, treatment: false }
          })
          setShowConsentConfirmation(true)
        }
      }
    } catch {
      setPendingConsentData({
        visitId: null,
        consentStatus: { hipaa: false, privacy: false, treatment: false }
      })
      setShowConsentConfirmation(true)
    }
  }, [])

  useEffect(() => {
    const fromConsentPage = sessionStorage.getItem('fromConsentPage')
    if (fromConsentPage === 'true') {
      sessionStorage.removeItem('fromConsentPage')
      checkConsentStatus()
    }
  }, [checkConsentStatus])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'CONSENT_SUBMITTED') {
        console.log('Consent submitted for visit:', event.data.visitId)
        refreshVisitStates()
        setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [refreshVisitStates, setTime])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'consentSubmissionEvent' && event.newValue) {
        try {
          const eventData = JSON.parse(event.newValue)
          if (eventData.type === 'CONSENT_SUBMITTED') {
            console.log('Consent submitted in another tab for visit:', eventData.visitId)
            setPendingConsentData(eventData)
            setShowConsentConfirmation(true)
          }
        } catch (error) {
          console.error('Error parsing consent submission event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      refreshVisitStates()
      const fromConsentPage = sessionStorage.getItem('fromConsentPage')
      if (fromConsentPage === 'true') {
        sessionStorage.removeItem('fromConsentPage')
        checkConsentStatus()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshVisitStates, checkConsentStatus])

  const handleCloseConsentConfirmation = useCallback(() => {
    if (pendingConsentData?.visitId) {
      localStorage.removeItem(`consentFormsStatus-${pendingConsentData.visitId}`)
      localStorage.removeItem('consentSubmissionEvent')
    } else {
      localStorage.removeItem('consentFormsStatus')
      localStorage.removeItem('consentSubmissionEvent')
    }
    setShowConsentConfirmation(false)
    setPendingConsentData(null)
  }, [pendingConsentData])

  return {
    showConsentModal,
    showConsentConfirmation,
    showConsentLoading,
    showConsentSuccess,
    pendingConsentData,
    setShowConsentModal,
    handleConsentConfirmation,
    handleCloseConsentConfirmation
  }
}
