import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GenerateCodeChallenge, GenerateRandomString, GetRandomInteger } from './Generate'

// @ts-expect-error vi.Mock should work
let mockGetRandomValues: vi.Mock

describe('generate Utilities', () => {
  describe('getRandomInteger', () => {
    beforeEach(() => {
      mockGetRandomValues = vi.fn()
      vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(mockGetRandomValues)
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('should return a number within the specified range', () => {
      mockGetRandomValues.mockImplementation((array: Uint8Array) => {
        array[0] = 5
      })
      const range = 10
      const result = GetRandomInteger(range)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(range)
    })

    it('should call itself recursively if the generated number is out of range', () => {
      mockGetRandomValues
        .mockImplementationOnce((array: Uint8Array) => { array[0] = 255 })
        .mockImplementationOnce((array: Uint8Array) => { array[0] = 5 })

      const range = 10
      const result = GetRandomInteger(range)

      expect(mockGetRandomValues).toHaveBeenCalledTimes(2)
      expect(result).toBe(5)
    })
  })

  describe('generateRandomString', () => {
    it('should generate a string of the specified length', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5)
      const length = 10
      const result = GenerateRandomString(length)
      expect(result.length).toBe(length)
      vi.restoreAllMocks()
    })

    it('should only contain valid characters', () => {
      vi.spyOn(globalThis.Math, 'random').mockReturnValue(0.5)
      const result = GenerateRandomString(100)
      expect(result).toMatch(/^[A-Z0-9]+$/i)
      vi.restoreAllMocks()
    })
  })

  describe('generateCodeChallenge', () => {
    it('should generate a valid code challenge from a code verifier', async () => {
      const codeVerifier = 'test_code_verifier'
      const result = await GenerateCodeChallenge(codeVerifier)

      // The result should be a base64url encoded string
      expect(result).toMatch(/^[\w-]+$/)

      // The result should not contain padding characters
      expect(result).not.toContain('=')

      // The result should have a specific length (43 characters for SHA-256)
      expect(result.length).toBe(43)
    })

    it('should generate different challenges for different verifiers', async () => {
      const verifier1 = 'test_verifier_1'
      const verifier2 = 'test_verifier_2'

      const result1 = await GenerateCodeChallenge(verifier1)
      const result2 = await GenerateCodeChallenge(verifier2)

      expect(result1).not.toBe(result2)
    })
  })
})
