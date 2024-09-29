import { useCallback } from 'react'
import ROUTES from '@/data/routing/routes'
import { useAuthentication } from '@/models/auth/hooks/useAuthentication'
import { ApiCall } from '@/base_submod/utils/api/API'

interface LogoutResponse {
  success: boolean
}

export function useLogout() {
  const authChecker = useAuthentication()

  const logout = useCallback(async () => {
    const logoutUrl = `${import.meta.env.VITE_APP_MIDDLEWARE_URL}/middleware/api/authentication/logout`

    if (authChecker.isValidToken()) {
      const user = localStorage.getItem('user')
      const token = user ? JSON.parse(user).AccessToken : null

      if (token) {
        const response: LogoutResponse = await ApiCall({
          requestType: 'POST',
          body: {
            accessToken: token,
          },
          path: logoutUrl,
        }) as LogoutResponse

        if (response.success) {
          authChecker.deauthenticate()
        }
      }
    }

    localStorage.clear()
    window.location.href = ROUTES.auth.login.href
  }, [authChecker])

  return logout
}
