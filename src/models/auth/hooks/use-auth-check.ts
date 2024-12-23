import { useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { useAuthStore } from '../stores/auth-store'

export function useAuthCheck() {
  const { instance } = useMsal()
  const { setCurrentUser, clearCurrentUser, setIdToken } = useAuthStore()

  useEffect(() => {
    const checkAuthStatus = async () => {
      const currentAccounts = instance.getAllAccounts()

      if (currentAccounts.length > 0) {
        const account = currentAccounts[0]

        try {
          const silentRequest = {
            account,
            scopes: ['openid', 'profile', 'email'],
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
          clearCurrentUser()
        }
      }
      else {
        clearCurrentUser()
      }
    }

    checkAuthStatus()

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
    }
  }, [instance, setCurrentUser, clearCurrentUser, setIdToken])
}
