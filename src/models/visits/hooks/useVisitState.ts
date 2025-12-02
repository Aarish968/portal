import { useState, useCallback, useEffect } from 'react'
import { Visit } from '../components/visits/types'

export function useVisitState(initialVisits: Visit[]) {
  const [visits, setVisits] = useState<Visit[]>(initialVisits)

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
    refreshVisitStates()
  }, [refreshVisitStates])

  return { visits, refreshVisitStates }
}
