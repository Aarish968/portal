import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  ClearAllLocalStorage,
  DecryptData,
  EncryptData,
  GetAuthTokenFromStorage,
  GetLocalStorageData,
  SetLocalStorageData,
} from './LocalStorage'

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('encryptData and DecryptData', () => {
    it('should encrypt and decrypt data correctly', () => {
      const testData = { name: 'John Doe', age: 30 }
      const encrypted = EncryptData(testData)
      expect(typeof encrypted).toBe('string')
      expect(encrypted).not.toBe(JSON.stringify(testData))

      const decrypted = DecryptData(encrypted)
      expect(JSON.parse(decrypted)).toEqual(testData)
    })

    it('should handle various data types', () => {
      const testCases = [
        123,
        'test string',
        true,
        [1, 2, 3],
        { a: 1, b: '2', c: true },
      ]

      testCases.forEach((testCase) => {
        const encrypted = EncryptData(testCase)
        const decrypted = JSON.parse(DecryptData(encrypted))
        expect(decrypted).toEqual(testCase)
      })
    })
  })

  describe('setLocalStorageData and GetLocalStorageData', () => {
    it('should set and get data from localStorage', () => {
      const key = 'testKey'
      const value = { test: 'data' }

      SetLocalStorageData(key, value)
      const retrieved = GetLocalStorageData(key)

      expect(retrieved).toEqual(value)
    })

    it('should return an empty string for non-existent keys', () => {
      const result = GetLocalStorageData('nonExistentKey')
      expect(result).toBe('')
    })

    it('should return an empty string for invalid encrypted data', () => {
      localStorage.setItem('invalidKey', 'invalidData')
      const result = GetLocalStorageData('invalidKey')
      expect(result).toBe('')
    })
  })

  describe('clearAllLocalStorage', () => {
    it('should clear all items from localStorage', () => {
      localStorage.setItem('key1', 'value1')
      localStorage.setItem('key2', 'value2')

      ClearAllLocalStorage()

      expect(localStorage.length).toBe(0)
    })
  })

  describe('getAuthTokenFromStorage', () => {
    it('should return the access token when user data is valid', () => {
      const userData = { AccessToken: 'validToken123' }
      localStorage.setItem('user', JSON.stringify(userData))

      const result = GetAuthTokenFromStorage()
      expect(result).toBe('validToken123')
    })

    it('should return an empty string when user data is not found', () => {
      const result = GetAuthTokenFromStorage()
      expect(result).toBe('')
    })

    it('should return an empty string when user data is invalid JSON', () => {
      localStorage.setItem('user', 'invalidJSON')

      const result = GetAuthTokenFromStorage()
      expect(result).toBe('')
    })

    it('should return an empty string when AccessToken is missing', () => {
      const userData = { someOtherField: 'value' }
      localStorage.setItem('user', JSON.stringify(userData))

      const result = GetAuthTokenFromStorage()
      expect(result).toBe('')
    })
  })
})
