import React, { useEffect, useState } from 'react'
import { useAuthentication } from '@/models/auth/hooks/useAuthentication'
import ROUTES from '@/data/routing/routes'

const PrivateRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authentication = useAuthentication()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null | undefined | 0>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = authentication.isValidToken()
      setIsAuthenticated(isValid)
    }

    checkAuth()
  }, [authentication])

  useEffect(() => {
    if (isAuthenticated === false) {
      const loginUrl = ROUTES.auth.login.href
      window.location.replace(loginUrl)
    }
  }, [isAuthenticated])

  if (isAuthenticated === null) {
    return <div>Loading...</div>
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return null
}

export default PrivateRoutes
