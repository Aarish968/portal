import { useState, useEffect, useCallback } from 'react'
import { VisitState, OutcomeValue, VisitStatus } from '../types'
import { VisitStorageService } from '../services/visit-storage.service'
import { VisitProgressService } from '../services/visit-progress.service'

interface UseVisitStateProps {
  visitId: string
  initialVisit?: {
    patientName: string
    address: string
    time: string
    insurance: string
    status?: VisitStatus
  }
}

interface UseVisitStateReturn {
  visitState: VisitState
  outcomes: Record<string, OutcomeValue>
  procedureReasons: Record<string, string>
  visitStatus: VisitStatus
  isInitialLoad: boolean
  updateOutcome: (procedureId: string, outcome: OutcomeValue, reason?: string) => void
  updateVisitStatus: (status: VisitStatus) => void
  saveVisit: () => Promise<void>
  progressData: {
    completedCount: number
    totalOutcomesSet: number
    progressPercent: number
    allOutcomesSet: boolean
    needsSaving: boolean
  }
}

/**
 * Custom hook for managing visit state and outcomes
 */
export function useVisitState({ visitId, initialVisit }: UseVisitStateProps): UseVisitStateReturn {
  const [visitState, setVisitState] = useState<VisitState>(() => ({
    id: visitId,
    patientName: initialVisit?.patientName || 'Unknown Patient',
    address: initialVisit?.address || 'Unknown Address',
    time: initialVisit?.time || 'Unknown Time',
    insurance: initialVisit?.insurance || 'Unknown Insurance',
    status: 'not-started',
    outcomes: {},
    procedureReasons: {}
  }))
  
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Load saved data on mount
  useEffect(() => {
    const savedState = VisitStorageService.loadVisitState(visitId)
    
    if (savedState) {
      setVisitState(savedState)
    } else if (initialVisit) {
      // Create initial state from props
      const newState: VisitState = {
        id: visitId,
        patientName: initialVisit.patientName,
        address: initialVisit.address,
        time: initialVisit.time,
        insurance: initialVisit.insurance,
        status: initialVisit.status || 'not-started',
        outcomes: {},
        procedureReasons: {}
      }
      setVisitState(newState)
      VisitStorageService.saveVisitState(newState)
    }
    
    setIsInitialLoad(false)
  }, [visitId, initialVisit])

  // Auto-save when state changes (except during initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      VisitStorageService.saveVisitState(visitState)
    }
  }, [visitState, isInitialLoad])

  // Auto-update status based on outcomes
  useEffect(() => {
    if (isInitialLoad) return
    
    const nextStatus = VisitProgressService.getNextStatus(
      visitState.status, 
      visitState.outcomes, 
      isInitialLoad
    )
    
    if (nextStatus !== visitState.status) {
      setVisitState(prev => ({ ...prev, status: nextStatus }))
    }
  }, [visitState.outcomes, visitState.status, isInitialLoad])

  const updateOutcome = useCallback((procedureId: string, outcome: OutcomeValue, reason?: string) => {
    setVisitState(prev => {
      const newOutcomes = { ...prev.outcomes, [procedureId]: outcome }
      const newReasons = reason 
        ? { ...prev.procedureReasons, [procedureId]: reason }
        : prev.procedureReasons
      
      return {
        ...prev,
        outcomes: newOutcomes,
        procedureReasons: newReasons
      }
    })
  }, [])

  const updateVisitStatus = useCallback((status: VisitStatus) => {
    setVisitState(prev => ({ ...prev, status }))
  }, [])

  const saveVisit = useCallback(async (): Promise<void> => {
    return new Promise((resolve) => {
      setVisitState(prev => ({ ...prev, status: 'completed' }))
      
      // Simulate API call delay
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  }, [])

  // Calculate progress data
  const progressData = {
    completedCount: VisitProgressService.getCompletedCount(visitState.outcomes),
    totalOutcomesSet: VisitProgressService.getTotalOutcomesSet(visitState.outcomes),
    progressPercent: VisitProgressService.getProgressPercentage(visitState.outcomes),
    allOutcomesSet: VisitProgressService.areAllOutcomesSet(visitState.outcomes),
    needsSaving: VisitProgressService.needsSaving(visitState)
  }

  return {
    visitState,
    outcomes: visitState.outcomes,
    procedureReasons: visitState.procedureReasons,
    visitStatus: visitState.status,
    isInitialLoad,
    updateOutcome,
    updateVisitStatus,
    saveVisit,
    progressData
  }
}