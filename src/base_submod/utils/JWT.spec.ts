import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import type {
  TokenResponse,
} from './JWT'
import {
  CODE_VERIFIER_STORAGE_KEY,
  IsValidToken,
  MapAndStoreTokens,
  PrepareTokenRequestData,
  RequestTokens,
} from './JWT'

vi.mock('jwt-decode')
vi.mock('axios')

describe('jWT Utilities', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    sessionStorage.clear()
  })

  describe('isValidToken', () => {
    it('should return false when no user data in localStorage', () => {
      expect(IsValidToken()).toBe(false)
    })

    it('should return false when AccessToken is missing', () => {
      localStorage.setItem('user', JSON.stringify({}))
      expect(IsValidToken()).toBe(false)
    })

    it('should return true for a valid, non-expired token', () => {
      const mockToken = 'valid_token'
      localStorage.setItem('user', JSON.stringify({ AccessToken: mockToken }))
      vi.mocked(jwtDecode).mockReturnValue({ exp: Date.now() / 1000 + 3600 })
      expect(IsValidToken()).toBe(true)
    })

    it('should return false for an expired token', () => {
      const mockToken = 'expired_token'
      localStorage.setItem('user', JSON.stringify({ AccessToken: mockToken }))
      vi.mocked(jwtDecode).mockReturnValue({ exp: Date.now() / 1000 - 3600 })
      expect(IsValidToken()).toBe(false)
    })
  })

  describe('prepareTokenRequestData', () => {
    it('should prepare data for authorization_code grant type', async () => {
      const mockSearch = '?code=test_code'
      sessionStorage.setItem(CODE_VERIFIER_STORAGE_KEY, 'test_verifier')
      const result = await PrepareTokenRequestData(mockSearch)
      expect(result).toEqual({
        grant_type: 'authorization_code',
        code: 'test_code',
        client_id: import.meta.env.VITE_APP_COGNITO_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_APP_COGNITO_REDIRECT_URL,
        code_verifier: 'test_verifier',
      })
    })

    it('should prepare data for refresh_token grant type', async () => {
      localStorage.setItem('user', JSON.stringify({ RefreshToken: 'test_refresh_token' }))
      const result = await PrepareTokenRequestData('', 'refresh_token')
      expect(result).toEqual({
        grant_type: 'refresh_token',
        refresh_token: 'test_refresh_token',
        client_id: import.meta.env.VITE_APP_COGNITO_CLIENT_ID,
        redirect_uri: import.meta.env.VITE_APP_COGNITO_REDIRECT_URL,
      })
    })

    it('should throw an error when code is missing for authorization_code grant', async () => {
      await expect(PrepareTokenRequestData('')).rejects.toThrow('Code is missing from search params')
    })

    it('should throw an error when code verifier is missing for authorization_code grant', async () => {
      await expect(PrepareTokenRequestData('?code=test_code')).rejects.toThrow('Code verifier is missing from session storage')
    })

    it('should throw an error when user data is missing for refresh_token grant', async () => {
      await expect(PrepareTokenRequestData('', 'refresh_token')).rejects.toThrow('User data is missing from local storage')
    })
  })

  describe('requestTokens', () => {
    it('should send a POST request with correct data', async () => {
      const mockAuthData = {
        grant_type: 'authorization_code' as const,
        code: 'test_code',
        client_id: 'test_client_id',
        redirect_uri: 'test_redirect_uri',
        code_verifier: 'test_verifier',
      }
      const mockResponse = { data: { access_token: 'test_access_token' } }
      vi.mocked(axios.post).mockResolvedValue(mockResponse)

      const result = await RequestTokens(mockAuthData)
      expect(result).toEqual(mockResponse)
      expect(axios.post).toHaveBeenCalledWith(
        import.meta.env.VITE_APP_COGNIT_OAUTH_URL,
        mockAuthData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      )
    })
  })

  describe('mapAndStoreTokens', () => {
    it('should map and store token response correctly', () => {
      const mockResponse: TokenResponse = {
        id_token: 'test_id_token',
        access_token: 'test_access_token',
        expires_in: '3600',
        token_type: 'Bearer',
      }
      const result = MapAndStoreTokens(mockResponse)
      expect(result).toEqual({
        IdToken: 'test_id_token',
        AccessToken: 'test_access_token',
        ExpiresIn: '3600',
        TokenType: 'Bearer',
      })
      expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(result)
    })

    it('should preserve RefreshToken if it exists in localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ RefreshToken: 'existing_refresh_token' }))
      const mockResponse: TokenResponse = {
        access_token: 'new_access_token',
      }
      const result = MapAndStoreTokens(mockResponse)
      expect(result).toEqual({
        AccessToken: 'new_access_token',
        RefreshToken: 'existing_refresh_token',
      })
      expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual(result)
    })
  })
})
