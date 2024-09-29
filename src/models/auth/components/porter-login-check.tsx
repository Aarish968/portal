import { useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuthentication } from '@/models/auth/hooks/useAuthentication'

function PorterLoginCheck() {
  const { search } = useLocation()
  const searchParams = new URLSearchParams(search)
  const {
    isValidToken,
    getToken,
    redirectToCustomLogin,
  } = useAuthentication()

  const handleGetToken = useCallback(async () => {
    await getToken()
  }, [getToken])

  useEffect(() => {
    const code = searchParams.get('code')

    if (code) {
      handleGetToken()
    }
    else if (!isValidToken()) {
      redirectToCustomLogin()
    }
  }, [handleGetToken, isValidToken, redirectToCustomLogin, searchParams])

  return <Outlet />
}

export { PorterLoginCheck }
