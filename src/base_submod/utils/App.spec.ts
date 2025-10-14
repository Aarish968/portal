import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { jwtDecode } from 'jwt-decode'
import { ACCOUNT_TYPES } from '../data/App'
import { GetCognitoId, IsInPreviewMode } from '../utils/App'
import { GetAuthTokenFromStorage } from '../utils/LocalStorage'

vi.mock('./LocalStorage')
vi.mock('jwt-decode')

describe('app Utilities', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.resetAllMocks()
    sessionStorage.clear()
  })

  describe('isInPreviewMode', () => {
    it('should return true when in preview mode', () => {
      sessionStorage.setItem('userViewType', ACCOUNT_TYPES.careGiver)
      sessionStorage.setItem('careReceiverUUID', 'some-uuid')
      expect(IsInPreviewMode()).toBe(true)
    })

    it('should return false when user type is not caregiver', () => {
      sessionStorage.setItem('userViewType', ACCOUNT_TYPES.user)
      sessionStorage.setItem('careReceiverUUID', 'some-uuid')
      expect(IsInPreviewMode()).toBe(false)
    })

    it('should return false when careReceiverUUID is null', () => {
      sessionStorage.setItem('userViewType', ACCOUNT_TYPES.careGiver)
      sessionStorage.setItem('careReceiverUUID', '')
      expect(IsInPreviewMode()).toBe(false)
    })

    it('should return false when careReceiverUUID is empty', () => {
      sessionStorage.setItem('userViewType', ACCOUNT_TYPES.careGiver)
      sessionStorage.setItem('careReceiverUUID', '')
      expect(IsInPreviewMode()).toBe(false)
    })
  })

  describe('getCognitoId', () => {
    it('should return empty string when no token is available', () => {
      vi.mocked(GetAuthTokenFromStorage).mockReturnValue('')
      expect(GetCognitoId()).toBe('')
    })

    it('should return username from decoded token', () => {
      const mockToken = 'mock-token'
      const mockDecodedToken = { username: 'test-user' }
      vi.mocked(GetAuthTokenFromStorage).mockReturnValue(mockToken)
      vi.mocked(jwtDecode).mockReturnValue(mockDecodedToken)
      expect(GetCognitoId()).toBe('test-user')
    })

    it('should return empty string when username is not in decoded token', () => {
      const mockToken = 'mock-token'
      const mockDecodedToken = { someOtherField: 'value' }
      vi.mocked(GetAuthTokenFromStorage).mockReturnValue(mockToken)
      vi.mocked(jwtDecode).mockReturnValue(mockDecodedToken)
      expect(GetCognitoId()).toBe('')
    })

    it('should return empty string and log error when token decoding fails', () => {
      const mockToken = 'invalid-token'
      vi.mocked(GetAuthTokenFromStorage).mockReturnValue(mockToken)
      vi.mocked(jwtDecode).mockImplementation(() => {
        throw new Error('Invalid token')
      })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      expect(GetCognitoId()).toBe('')
      expect(consoleSpy).toHaveBeenCalledWith('Error decoding token:', expect.any(Error))
    })
  })
})
