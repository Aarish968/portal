import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GetLocalStorageData } from '../LocalStorage'
import { Del, Get, Post, Put, Request, Url } from './BaseAPI'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

vi.mock('../LocalStorage', () => ({
  GetLocalStorageData: vi.fn(),
}))

function createMockResponse(status: number, data: any) {
  return {
    status,
    headers: new Headers(),
    text: () => Promise.resolve(JSON.stringify(data)),
    json: () => Promise.resolve(data),
  }
}

describe('baseAPI', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('get', () => {
    it('should make a GET request', async () => {
      const mockResponse = createMockResponse(200, { data: 'test' })
      mockFetch.mockResolvedValue(mockResponse)

      const result = await Get({ path: '/test' })
      expect(result).toEqual({ status: 200, data: { data: 'test' } })
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({ method: 'get' }))
    })
  })

  describe('post', () => {
    it('should make a POST request', async () => {
      const mockResponse = createMockResponse(201, { data: 'created' })
      mockFetch.mockResolvedValue(mockResponse)

      const result = await Post({ path: '/test', body: { key: 'value' } })
      expect(result).toEqual({ status: 201, data: { data: 'created' } })
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        method: 'post',
        body: JSON.stringify({ key: 'value' }),
      }))
    })
  })

  describe('put', () => {
    it('should make a PUT request', async () => {
      const mockResponse = createMockResponse(200, { data: 'updated' })
      mockFetch.mockResolvedValue(mockResponse)

      const result = await Put({ path: '/test', body: { key: 'newValue' } })
      expect(result).toEqual({ status: 200, data: { data: 'updated' } })
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        method: 'put',
        body: JSON.stringify({ key: 'newValue' }),
      }))
    })
  })

  describe('del', () => {
    it('should make a DELETE request', async () => {
      const mockResponse = createMockResponse(204, null)
      mockFetch.mockResolvedValue(mockResponse)

      const result = await Del({ path: '/test' })
      expect(result).toEqual({ status: 204, data: null })
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({ method: 'delete' }))
    })
  })

  describe('request', () => {
    it('should make a custom request', async () => {
      const mockResponse = createMockResponse(200, { data: 'custom' })
      mockFetch.mockResolvedValue(mockResponse)

      const result = await Request({ method: 'PATCH', path: '/test', body: { key: 'patch' } })
      expect(result).toEqual({ status: 200, headers: expect.any(Headers), body: { status: 200, data: { data: 'custom' } } })
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ key: 'patch' }),
      }))
    })
  })

  describe('url', () => {
    it('should return the input path', () => {
      const path = '/test/path'
      expect(Url(path)).toBe(path)
    })
  })

  describe('authentication', () => {
    it('should add Authorization header when auth token is present', async () => {
      const mockUserData = { authToken: 'test-token' }
      vi.mocked(GetLocalStorageData).mockReturnValue(mockUserData)

      const mockResponse = createMockResponse(200, { data: 'authenticated' })
      mockFetch.mockResolvedValue(mockResponse)

      await Get({ path: '/authenticated' })
      expect(mockFetch).toHaveBeenCalledWith('/authenticated', expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }))
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      await expect(Get({ path: '/error' })).rejects.toThrow('Network error')
    })

    it('should handle timeout', async () => {
      vi.useFakeTimers()
      mockFetch.mockImplementation(() => new Promise(() => {}))

      const getPromise = Get({ path: '/timeout' })
      vi.advanceTimersByTime(60001)

      await expect(getPromise).rejects.toThrow('timeout')

      vi.useRealTimers()
    })
  })
})
