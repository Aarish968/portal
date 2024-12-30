import { useCallback, useEffect, useRef } from 'react'
import { useMsal } from '@azure/msal-react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { useAuthStore } from '../stores/auth-store'

const TOKEN_CHECK_INTERVAL = 5 * 60 * 1000

export function useAuthCheck() {
  const { instance } = useMsal()
  const { setCurrentUser, clearCurrentUser, setIdToken, refreshTokenIfNeeded } = useAuthStore()
  const refreshIntervalRef = useRef<number>()

  const checkAuthStatus = useCallback(async () => {
    const currentAccounts = instance.getAllAccounts()

    if (currentAccounts.length > 0) {
      const account = currentAccounts[0]

      try {
        const silentRequest = {
          account,
          scopes: ['openid', 'profile', 'email'],
          forceRefresh: true,
          refreshTokenExpirationOffsetSeconds: 7200,
        }

        const response = await instance.acquireTokenSilent(silentRequest)

        setCurrentUser({
          id: account.localAccountId,
          name: account.name || '',
          username: account.username,
          role: 'user',
          createdAt: new Date(),
          lastLogin: new Date(),
          homeAccountId: account.homeAccountId,
          tenantId: account.tenantId,
          localAccountId: account.localAccountId,
          environment: account.environment,
          idTokenClaims: account.idTokenClaims as any,
        })

        if (response.idToken) {
          setIdToken(response.idToken)
          window.dispatchEvent(new Event('auth-ready'))
        }
      }
      catch (error) {
        console.error('Failed to acquire token silently:', error)
        if (error instanceof InteractionRequiredAuthError) {
          try {
            const popupRequest = {
              account,
              scopes: ['openid', 'profile', 'email'],
            }
            const response = await instance.acquireTokenPopup(popupRequest)
            if (response.idToken) {
              setIdToken(response.idToken)
              window.dispatchEvent(new Event('auth-ready'))
            }
          }
          catch (popupError) {
            console.error('Failed to acquire token with popup:', popupError)
            clearCurrentUser()
          }
        }
        else {
          clearCurrentUser()
        }
      }
    }
    else {
      clearCurrentUser()
    }
  }, [instance, setCurrentUser, clearCurrentUser, setIdToken])

  useEffect(() => {
    checkAuthStatus()

    refreshIntervalRef.current = window.setInterval(() => {
      refreshTokenIfNeeded()
    }, TOKEN_CHECK_INTERVAL)

    const callback = (event: any) => {
      if (event.eventType === 'msal:loginSuccess') {
        checkAuthStatus()
      }
      if (event.eventType === 'msal:logoutSuccess') {
        clearCurrentUser()
      }
    }

    const callbackId = instance.addEventCallback(callback)

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId)
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [instance, checkAuthStatus, clearCurrentUser, refreshTokenIfNeeded])
}
