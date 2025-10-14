import { describe, expect, it } from 'vitest'
import { CapitalizeString } from './Strings'

describe('strings utils', () => {
  describe('capitalizeString', () => {
    it('should capitalize the first letter of a string', () => {
      expect(CapitalizeString('hello')).toBe('Hello')
      expect(CapitalizeString('world')).toBe('World')
    })

    it('should return an empty string for empty input', () => {
      expect(CapitalizeString('')).toBe('')
    })

    it('should return an empty string for undefined input', () => {
      expect(CapitalizeString(undefined)).toBe('')
    })

    it('should not change already capitalized strings', () => {
      expect(CapitalizeString('Hello')).toBe('Hello')
      expect(CapitalizeString('World')).toBe('World')
    })

    it('should handle single-character strings', () => {
      expect(CapitalizeString('a')).toBe('A')
      expect(CapitalizeString('z')).toBe('Z')
    })

    it('should not change strings starting with numbers or symbols', () => {
      expect(CapitalizeString('123abc')).toBe('123abc')
      expect(CapitalizeString('!hello')).toBe('!hello')
    })

    it('should handle mixed case strings', () => {
      expect(CapitalizeString('hElLo')).toBe('HElLo')
      expect(CapitalizeString('wOrLd')).toBe('WOrLd')
    })
  })
})
