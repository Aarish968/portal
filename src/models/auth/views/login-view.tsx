import { useEffect, useState } from 'react'
import { AuthError, InteractionStatus } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/data/routing/routes'
import { initializeMsal } from '@/base_submod/utils/MSAL'
import { Button } from '@/base_submod/components/ui/button'
import { useAuthStore } from '@/models/auth/stores/auth-store'
import PorterLogo from '@/base_submod/assets/images/logos/porter-logo-vertical.svg'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/base_submod/components/ui/card'

function LoginView() {
  const { instance, inProgress } = useMsal()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setCurrentUser } = useAuthStore()

  useEffect(() => {
    const handleRedirectPromise = async () => {
      try {
        await initializeMsal()
        const result = await instance.handleRedirectPromise()
        if (result) {
          const userAccount = result.account
          if (userAccount) {
            setCurrentUser({
              id: userAccount.localAccountId,
              name: userAccount.name || '',
              username: userAccount.username,
              role: 'user',
              createdAt: new Date(),
              lastLogin: new Date(),
              homeAccountId: userAccount.homeAccountId,
              tenantId: userAccount.tenantId,
              localAccountId: userAccount.localAccountId,
              environment: userAccount.environment,
              idTokenClaims: userAccount.idTokenClaims as any,
            })
          }
          navigate(ROUTES.app.hraActivity.href)
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

    handleRedirectPromise()
  }, [instance, navigate, setCurrentUser])

  const handleLogin = async () => {
    if (inProgress !== InteractionStatus.None) {
      setError('Authentication already in progress')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await instance.loginRedirect()
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
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">
            <img src={PorterLogo} alt="Porter Logo" className="mx-auto mb-4 w-32" />
            Welcome
          </CardTitle>
          <CardDescription className="text-center">
            Click the button below to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={isLoading || inProgress !== InteractionStatus.None}
          >
            {isLoading || inProgress !== InteractionStatus.None ? 'Signing in...' : 'Sign in'}
          </Button>
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginView
