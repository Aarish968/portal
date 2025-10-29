import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { AuthError, InteractionStatus } from '@azure/msal-browser'
import { Button } from '@/base_submod/components/ui/button'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { instance, accounts, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  // Skip authentication in development mode
  const isDevelopment = import.meta.env.DEV || import.meta.env.VITE_SKIP_AUTH === 'true'
  
  if (isDevelopment) {
    return <>{children}</>
  }

  useEffect(() => {
    const handleAuth = async () => {
      if (!isAuthenticated && inProgress === InteractionStatus.None) {
        try {
          if (accounts.length > 0) {
            instance.setActiveAccount(accounts[0])
          }
          else {
            navigate('/login')
          }
        }
        catch (err) {
          if (err instanceof AuthError) {
            setError(`Authentication error: ${err.errorMessage}`)
          }
          else if (err instanceof Error) {
            setError(`Unexpected error: ${err.message}`)
          }
          else {
            setError('An unknown error occurred')
          }
        }
      }
    }

    handleAuth()
  }, [isAuthenticated, inProgress, navigate, instance, accounts])

  if (error) {
    return (
      <div className=":uno: min-h-screen flex flex-col items-center justify-center">
        <p className=":uno: mb-4 text-red-500">{error}</p>
        <Button onClick={() => navigate('/login')}>Return to Login</Button>
      </div>
    )
  }

  if (inProgress !== InteractionStatus.None) {
    return (
      <div className=":uno: min-h-screen flex flex-col items-center justify-center">
        <p className=":uno: mb-4">Authentication in progress...</p>
        <p>Please complete the login process in the popup window.</p>
      </div>
    )
  }

  return isAuthenticated ? <>{children}</> : null
}

export default ProtectedRoute
