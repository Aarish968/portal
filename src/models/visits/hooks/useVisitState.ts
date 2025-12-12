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
          let outcome = null
          let matchedId = null
          
          // First try the exact procedureId if available (most reliable)
          if (p.procedureId && outcomes[p.procedureId]) {
            outcome = outcomes[p.procedureId]
            matchedId = p.procedureId
          } else {
            // Fallback to trying multiple possible procedure ID formats
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
            
            // Find the first matching outcome
            for (const id of possibleIds) {
              if (outcomes[id]) {
                outcome = outcomes[id]
                matchedId = id
                break
              }
            }
          }
          
          // Special mappings for common procedure names (based on API response)
          if (!outcome) {
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
            const specialId = specialMappings[p.name]
            if (specialId && outcomes[specialId]) {
              outcome = outcomes[specialId]
              matchedId = specialId
            }
          }
          
          // Debug logging (remove in production)
          if (Object.keys(outcomes).length > 0) {
            console.log(`useVisitState - Procedure: "${p.name}", ProcedureId: "${p.procedureId}", Matched ID: "${matchedId}", Outcome: "${outcome}"`)
            console.log(`useVisitState - Available outcomes:`, outcomes)
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
