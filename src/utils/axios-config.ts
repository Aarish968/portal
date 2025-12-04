import axios from 'axios'
import { useAuthStore } from '@/models/auth/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_VISITS_API_URL || 'https://0ku6tkr1e2.execute-api.us-east-2.amazonaws.com/prod'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  async (config) => {
    const authHeaders = await useAuthStore.getState().getAuthHeaders()
    config.headers.Authorization = authHeaders.Authorization
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - redirecting to login')
    }
    return Promise.reject(error)
  }
)
