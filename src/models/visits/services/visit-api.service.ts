import { axiosInstance } from '@/utils/axios-config'
import type { 
  VisitApiResponse, 
  UpdateLabPayload, 
  UpdateGapPayload, 
  UpdateResponse 
} from '../types/types'

export class VisitApiService {
  static async getVisits(username: string): Promise<VisitApiResponse[]> {
    const response = await axiosInstance.post<{ visits: VisitApiResponse[] }>('/visits/get', {
      username,
    })
    // Handle both old format (array) and new format (wrapped in visits property)
    return Array.isArray(response.data) ? response.data : response.data.visits
  }

  static async updateLab(payload: UpdateLabPayload): Promise<UpdateResponse[]> {
    const response = await axiosInstance.post<UpdateResponse[]>('/labs', payload)
    return response.data
  }

  static async updateGap(payload: UpdateGapPayload): Promise<UpdateResponse[]> {
    const response = await axiosInstance.post<UpdateResponse[]>('/gaps', payload)
    return response.data
  }
}
