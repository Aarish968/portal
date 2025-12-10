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
        const isCompleted = data?.status === 'completed'
        return {
          ...v,
          status: isCompleted ? 'completed' : v.status,
          procedures: v.procedures.map(p => ({ ...p, completed: isCompleted ? true : p.completed })),
          healthRiskAssessment: isCompleted ? 'completed' : v.healthRiskAssessment
        }
      }))
    } catch { }
  }, [])

  useEffect(() => {
    if (visits.length > 0) {
      refreshVisitStates()
    }
  }, [refreshVisitStates, visits.length])

  return { visits, refreshVisitStates }
}
