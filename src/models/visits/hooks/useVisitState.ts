import { useState, useCallback, useEffect } from 'react'
import type { Visit } from '../types/types'

export function useVisitState(initialVisits: Visit[]) {
  const [visits, setVisits] = useState<Visit[]>(initialVisits)

  // Update visits when initialVisits changes
  useEffect(() => {
    setVisits(initialVisits)
  }, [initialVisits])

  const refreshVisitStates = useCallback(() => {
    try {
      setVisits(prev => prev.map(v => {
        const raw = localStorage.getItem(`visit-state-${v.id}`)
        if (!raw) return v
        
        const data = JSON.parse(raw)
        const visitStatus = data?.status || v.status
        const outcomes = data?.outcomes || {}
        
        // Update procedures with individual outcomes
        const updatedProcedures = v.procedures.map(p => {
          // Try multiple possible procedure ID formats to find a match
          const possibleIds = [
            p.name.toLowerCase().replace(/\s+/g, '-'), // Standard format
            `gap-${p.name.toLowerCase().replace(/\s+/g, '-')}`, // Gap format
            'ked', // KED lab
            'gap-eed', // EED gap
            'a1c', // A1C lab
            'hba1c' // HbA1c lab
          ]
          
          // Find the first matching outcome
          let outcome = null
          let matchedId = null
          for (const id of possibleIds) {
            if (outcomes[id]) {
              outcome = outcomes[id]
              matchedId = id
              break
            }
          }
          
          // Special mappings for common procedure names
          if (!outcome) {
            const specialMappings: Record<string, string> = {
              'GFR, UACR': 'ked',
              'Fundospopic Imaging': 'gap-eed',
              'A1C': 'a1c',
              'HbA1c': 'hba1c'
            }
            const specialId = specialMappings[p.name]
            if (specialId && outcomes[specialId]) {
              outcome = outcomes[specialId]
              matchedId = specialId
            }
          }
          
          // Debug logging (remove in production)
          if (Object.keys(outcomes).length > 0) {
            console.log(`Procedure: "${p.name}", Matched ID: "${matchedId}", Outcome: "${outcome}", Available outcomes:`, Object.keys(outcomes))
          }
          
          // If user has set an outcome, use it; otherwise keep original status
          if (outcome === 'completed') {
            return { ...p, completed: true }
          } else if (outcome === 'not-completed') {
            return { ...p, completed: false }
          } else {
            // No user outcome, keep original API status
            return p
          }
        })
        
        return {
          ...v,
          status: visitStatus,
          procedures: updatedProcedures,
          healthRiskAssessment: visitStatus === 'completed' ? 'completed' : v.healthRiskAssessment
        }
      }))
    } catch { }
  }, [])

  useEffect(() => {
    if (visits.length > 0) {
      refreshVisitStates()
    }
  }, [refreshVisitStates, visits.length])

  // Listen for localStorage changes to update visit states
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('visit-state-')) {
        refreshVisitStates()
      }
    }

    const handleCustomStorageChange = (e: CustomEvent) => {
      if (e.detail.key && e.detail.key.startsWith('visit-state-')) {
        refreshVisitStates()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('localStorageChange', handleCustomStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('localStorageChange', handleCustomStorageChange as EventListener)
    }
  }, [refreshVisitStates])

  return { visits, refreshVisitStates }
}
