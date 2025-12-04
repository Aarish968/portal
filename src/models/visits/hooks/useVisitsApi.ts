import { useState } from 'react'
import { VisitApiService } from '../services/visit-api.service'
import type { 
  VisitApiResponse, 
  UpdateLabPayload, 
  UpdateGapPayload, 
  UpdateResponse 
} from '../types/types'

export function useVisitsApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getVisits = async (username: string): Promise<VisitApiResponse[] | null> => {
    setLoading(true)
    setError(null)
    try {
      const data = await VisitApiService.getVisits(username)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch visits'
      setError(errorMessage)
      console.error('Error fetching visits:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateLab = async (payload: UpdateLabPayload): Promise<UpdateResponse[] | null> => {
    setLoading(true)
    setError(null)
    try {
      const data = await VisitApiService.updateLab(payload)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update lab'
      setError(errorMessage)
      console.error('Error updating lab:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateGap = async (payload: UpdateGapPayload): Promise<UpdateResponse[] | null> => {
    setLoading(true)
    setError(null)
    try {
      const data = await VisitApiService.updateGap(payload)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update gap'
      setError(errorMessage)
      console.error('Error updating gap:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    getVisits,
    updateLab,
    updateGap,
    loading,
    error,
  }
}
