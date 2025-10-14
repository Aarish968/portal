import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'
import * as LocalStorage from '../LocalStorage'
import { ApiCall } from './API'
import * as BaseAPI from './BaseAPI'
import { TokenManager } from '@/base_submod/utils/api/TokenManager'

import.meta.env.MODE = 'test'

vi.mock('./BaseAPI')
vi.mock('../LocalStorage')
vi.mock('axios')

describe('api', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('apiCall', () => {
    it('should call GetApiCall for GET requests', async () => {
      const mockResponse = { success: true, data: 'test data', isLoading: false }
      vi.spyOn(BaseAPI, 'Get').mockResolvedValue({ status: 200, data: 'test data' })

      const result = await ApiCall({ path: '/test', requestType: 'GET' })
      expect(result).toEqual(mockResponse)
      expect(BaseAPI.Get).toHaveBeenCalledWith(expect.objectContaining({ path: '/test' }))
    })

    it('should call PostApiCall for POST requests', async () => {
      const mockResponse = { success: true, data: 'created', isLoading: false }
      vi.spyOn(BaseAPI, 'Post').mockResolvedValue({ status: 201, data: 'created' })

      const result = await ApiCall({ path: '/test', requestType: 'POST', body: { key: 'value' } })
      expect(result).toEqual(mockResponse)
      expect(BaseAPI.Post).toHaveBeenCalledWith(expect.objectContaining({ path: '/test', body: { key: 'value' } }))
    })

    it('should call DeleteApiCall for DELETE requests', async () => {
      const mockResponse = {
        data: null,
        success: true,
        isLoading: false,
      }
      vi.spyOn(BaseAPI, 'Del').mockResolvedValue({ status: 204, data: null })

      const result = await ApiCall({ path: '/test', requestType: 'DELETE' })
      expect(result).toEqual(mockResponse)
      expect(BaseAPI.Del).toHaveBeenCalledWith(expect.objectContaining({ path: '/test' }))
    })

    it('should call PutApiCall for PUT requests', async () => {
      const mockResponse = { success: true, data: 'updated', isLoading: false }
      vi.spyOn(BaseAPI, 'Put').mockResolvedValue({ status: 200, data: 'updated' })

      const result = await ApiCall({ path: '/test', requestType: 'PUT', body: { key: 'newValue' } })
      expect(result).toEqual(mockResponse)
      expect(BaseAPI.Put).toHaveBeenCalledWith(expect.objectContaining({ path: '/test', body: { key: 'newValue' } }))
    })

    it('should handle unauthorized responses', async () => {
      const getMock = vi.spyOn(BaseAPI, 'Get')
        .mockResolvedValueOnce({ status: 401, data: 'Unauthorized' })
        .mockResolvedValueOnce({ status: 200, data: 'Success after retry' })

      const mockAxiosPost = vi.fn().mockResolvedValue({
        data: {
          id_token: 'new_id_token',
          access_token: 'new_access_token',
          expires_in: '3600',
          token_type: 'Bearer',
        },
      })
      vi.mocked(axios.post).mockImplementation(mockAxiosPost)

      vi.spyOn(localStorage, 'getItem').mockReturnValue(JSON.stringify({ RefreshToken: 'refresh_token' }))
      const setItemMock = vi.spyOn(localStorage, 'setItem')

      let authTokenCallCount = 0
      vi.spyOn(LocalStorage, 'GetAuthTokenFromStorage')
        .mockImplementation(() => {
          authTokenCallCount++
          return authTokenCallCount === 1 ? '' : 'new_access_token'
        })

      const tokenManager = TokenManager.getInstance()
      vi.spyOn(tokenManager, 'isFetchingNewToken').mockReturnValue(false)
      vi.spyOn(tokenManager, 'isTokenUpdated').mockReturnValue(false)
      vi.spyOn(tokenManager, 'setFetchingNewToken')
      vi.spyOn(tokenManager, 'setTokenUpdated')

      const result = await ApiCall({ path: '/test', requestType: 'GET' })

      expect(result).toEqual({ success: true, data: 'Success after retry', isLoading: false })
      expect(getMock).toHaveBeenCalledTimes(2)
      expect(mockAxiosPost).toHaveBeenCalled()
      expect(setItemMock).toHaveBeenCalledWith('user', expect.stringContaining('new_access_token'))
      expect(tokenManager.setFetchingNewToken).toHaveBeenCalledWith(true)
      expect(tokenManager.setTokenUpdated).toHaveBeenCalledWith(true)
    })

    it('should handle retries', async () => {
      const mockErrorResponse = { status: 500, data: 'Server Error' }
      const mockSuccessResponse = { status: 200, data: 'Success after retry' }

      vi.spyOn(BaseAPI, 'Get')
        .mockResolvedValueOnce(mockErrorResponse)
        .mockResolvedValueOnce(mockSuccessResponse)

      const result = await ApiCall({ path: '/test', requestType: 'GET', retry: 1 })
      expect(result).toEqual({ success: true, data: 'Success after retry', isLoading: false })
      expect(BaseAPI.Get).toHaveBeenCalledTimes(2)
    })

    it('should handle API errors', async () => {
      vi.spyOn(BaseAPI, 'Get').mockResolvedValue({ status: 500, data: { message: 'Server Error' } })

      const result = await ApiCall({ path: '/test', requestType: 'GET' })
      expect(result).toEqual({
        success: false,
        error: {
          errorCode: 500,
          message: 'Server Error',
          apiError: { message: 'Server Error' },
        },
        isLoading: false,
      })
    })
  })
})
