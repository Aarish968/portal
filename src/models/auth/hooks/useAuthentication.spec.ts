import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLocation, useNavigate } from 'react-router-dom'
import { GenerateCodeChallenge } from '../../../assets/base_submod/utils/Generate'
import { useAuthentication } from './useAuthentication'

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(() => ({ search: '', pathname: '/', hash: '', state: null, key: '' })),
  useNavigate: vi.fn(),
}))

vi.mock('../../../utils/Generate', () => ({
  GenerateRandomString: vi.fn().mockImplementation(length => `mockRandomString${length}`),
  GenerateCodeChallenge: vi.fn().mockResolvedValue('mockCodeChallenge'),
}))

vi.mock('../../../utils/JWT', () => ({
  CODE_VERIFIER_STORAGE_KEY: 'code_verifier',
  IsValidToken: vi.fn(() => true),
  MapAndStoreTokens: vi.fn(),
  PrepareTokenRequestData: vi.fn(() => Promise.resolve({})),
  RequestTokens: vi.fn(() => Promise.resolve({ status: 200, data: {} })),
}))

describe('useAuthentication', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
    sessionStorage.clear()
    vi.mocked(useLocation).mockReturnValue({ search: '', pathname: '/', hash: '', state: null, key: '' })
  })

  it('should set isCaregiverUser correctly', () => {
    localStorage.setItem('userType', 'Caregiver')
    const { result } = renderHook(() => useAuthentication())
    expect(result.current.isCaregiverUser).toBe(true)
  })

  it('should redirect to custom login', () => {
    const mockNavigate = vi.fn()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)

    const { result } = renderHook(() => useAuthentication())
    act(() => {
      result.current.redirectToCustomLogin()
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })

  it('should generate and return a valid login URL', async () => {
    vi.mocked(useNavigate).mockReturnValue(vi.fn())
    vi.unmock('../../../utils/Generate')

    const { result } = renderHook(() => useAuthentication())

    let loginUrl: string | undefined
    await act(async () => {
      loginUrl = await result.current.getLoginUrl()
    })

    expect(loginUrl).toMatch(/^http(s)?:\/\/.+/)
    expect(loginUrl).toContain('code_challenge=')
    expect(loginUrl).toContain('code_challenge_method=S256')

    const codeVerifier = sessionStorage.getItem('code_verifier')
    expect(codeVerifier).toBeDefined()
    expect(codeVerifier?.length).toBe(96)
    expect(codeVerifier).toMatch(/^[\w\-.~]{96}$/)

    const challengeInUrl = new URL(loginUrl as string).searchParams.get('code_challenge')
    const expectedChallenge = await GenerateCodeChallenge(codeVerifier as string)
    expect(challengeInUrl).toBe(expectedChallenge)
  })
})
