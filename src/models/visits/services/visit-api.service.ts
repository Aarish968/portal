import { axiosInstance } from '@/utils/axios-config'
import type { 
  VisitApiResponse, 
  UpdateLabPayload, 
  UpdateGapPayload, 
  UpdateResponse 
} from '../types/types'

export class VisitApiService {
  static async getVisits(username: string): Promise<VisitApiResponse[]> {
    const response = await axiosInstance.post<VisitApiResponse[]>('/visits/get', {
      username,
    })
    return response.data
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
