import { useState, useEffect, useCallback } from 'react'
import { ConsentStatus } from '../types'
import { VisitStorageService } from '../services/visit-storage.service'
import { CONSENT_FORMS } from '../constants'

interface UseConsentFormsReturn {
  consentStatus: ConsentStatus
  updateConsentStatus: (formKey: string, status: boolean) => void
  getCompletedCount: () => number
  hasAnyCompleted: () => boolean
  areAllCompleted: () => boolean
  copyConsentLink: () => void
}

/**
 * Custom hook for managing consent forms
 */
export function useConsentForms(visitId: string): UseConsentFormsReturn {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({})

  // Load consent status on mount
  useEffect(() => {
    const savedStatus = VisitStorageService.loadConsentStatus(visitId)
    setConsentStatus(savedStatus)
  }, [visitId])

  // Auto-save when status changes
  useEffect(() => {
    VisitStorageService.saveConsentStatus(visitId, consentStatus)
  }, [visitId, consentStatus])

  const updateConsentStatus = useCallback((formKey: string, status: boolean) => {
    setConsentStatus(prev => ({
      ...prev,
      [formKey]: status
    }))
  }, [])

  const getCompletedCount = useCallback((): number => {
    return Object.values(consentStatus).filter(Boolean).length
  }, [consentStatus])

  const hasAnyCompleted = useCallback((): boolean => {
    return getCompletedCount() > 0
  }, [getCompletedCount])

  const areAllCompleted = useCallback((): boolean => {
    return getCompletedCount() === CONSENT_FORMS.length
  }, [getCompletedCount])

  const copyConsentLink = useCallback(() => {
    const consentLink = `${window.location.origin}/consent-forms?visitId=${visitId}`
    navigator.clipboard.writeText(consentLink).then(() => {
      console.log('Consent link copied to clipboard')
    }).catch(error => {
      console.error('Failed to copy consent link:', error)
    })
  }, [visitId])

  return {
    consentStatus,
    updateConsentStatus,
    getCompletedCount,
    hasAnyCompleted,
    areAllCompleted,
    copyConsentLink
  }
}