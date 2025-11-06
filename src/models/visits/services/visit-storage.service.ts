import { VisitState, ConsentStatus } from '../types'
import { STORAGE_KEYS } from '../constants'

/**
 * Service for managing visit data in localStorage/sessionStorage
 */
export class VisitStorageService {
  /**
   * Save visit state to localStorage
   */
  static saveVisitState(visitState: VisitState): void {
    try {
      const key = STORAGE_KEYS.VISIT_STATE(visitState.id)
      localStorage.setItem(key, JSON.stringify(visitState))
    } catch (error) {
      console.error('Failed to save visit state:', error)
    }
  }

  /**
   * Load visit state from localStorage
   */
  static loadVisitState(visitId: string): VisitState | null {
    try {
      const key = STORAGE_KEYS.VISIT_STATE(visitId)
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error('Failed to load visit state:', error)
      return null
    }
  }

  /**
   * Save consent status to sessionStorage
   */
  static saveConsentStatus(visitId: string, consentStatus: ConsentStatus): void {
    try {
      const key = STORAGE_KEYS.CONSENT_STATUS(visitId)
      sessionStorage.setItem(key, JSON.stringify(consentStatus))
    } catch (error) {
      console.error('Failed to save consent status:', error)
    }
  }

  /**
   * Load consent status from sessionStorage
   */
  static loadConsentStatus(visitId: string): ConsentStatus {
    try {
      const key = STORAGE_KEYS.CONSENT_STATUS(visitId)
      const stored = sessionStorage.getItem(key)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Failed to load consent status:', error)
      return {}
    }
  }

  /**
   * Get all visit IDs that have stored data
   */
  static getAllVisitIds(): string[] {
    const visitIds: string[] = []
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('visit-state-')) {
          const visitId = key.replace('visit-state-', '')
          visitIds.push(visitId)
        }
      }
    } catch (error) {
      console.error('Failed to get visit IDs:', error)
    }
    return visitIds
  }

  /**
   * Clear all visit data (for testing/reset purposes)
   */
  static clearAllVisitData(): void {
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('visit-state-') || key?.startsWith('consentFormsStatus-')) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Failed to clear visit data:', error)
    }
  }
}