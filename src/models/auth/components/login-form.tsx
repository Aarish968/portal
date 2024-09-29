import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
// import mixpanel from 'mixpanel-browser'
import type { LoginFormRequest } from '@/schemas/Forms'
import { LoginFormRequestSchema } from '@/schemas/Forms'

import { Button } from '@/base_submod/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/base_submod/components/ui/form'
import { Input } from '@/base_submod/components/ui/input'
import { ApiCall } from '@/base_submod/utils/api/API'
// import { GetCognitoId } from '@/utils/App'
import { ACCOUNT_TYPES } from '@/base_submod/data/App'
import ROUTES from '@/data/routing/routes'
// import { mixPanelData } from '@/utils/mixPanel' // Ensure this import is correct

const loginUrl = `${import.meta.env.VITE_APP_MIDDLEWARE_URL}/middleware/api/authentication/login`

interface AuthApiResponse {
  success: boolean
  data?: {
    value?: string
    AuthenticationResult?: unknown
    userType?: string
    displayType?: string
    isFirstTimeLogin?: string
    isEnrolled?: string
  }
  error?: {
    apiError?: {
      error?: string
    }
  }
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const form = useForm<LoginFormRequest>({
    resolver: zodResolver(LoginFormRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleNavigation = useCallback((path: string) => {
    window.location.replace(path)
  }, [navigate])

  async function onSubmit(data: LoginFormRequest) {
    setIsLoading(true)
    setError('')

    try {
      const response: AuthApiResponse = await ApiCall({
        requestType: 'POST',
        body: {
          userName: data.email,
          password: data.password,
        },
        path: loginUrl,
      }) as AuthApiResponse

      if (response.success && response.data) {
        if (response.data.value === 'email_sent') {
          // Handle email sent case if needed
        }
        else {
          localStorage.setItem('user', JSON.stringify(response.data.AuthenticationResult))
          localStorage.setItem('userType', response.data.userType || '')
          sessionStorage.setItem('userViewType', response.data.userType || '')
          localStorage.setItem('displayType', response.data.displayType || '')
          sessionStorage.setItem('displayViewType', response.data.displayType || '')
          localStorage.setItem('isFirstTimeLogin', response.data.isFirstTimeLogin || '')
          localStorage.setItem('isEnrolled', response.data.isEnrolled || '')

          const beforeLoginUrl = localStorage.getItem('sessionRedirectUrl')
          localStorage.removeItem('sessionRedirectUrl')
          sessionStorage.removeItem('careReceiverUUID')
          sessionStorage.removeItem('careName')

          Cookies.set('email', data.email)
          // mixpanel.identify(GetCognitoId())
          // mixpanel.people.set({ $name: GetCognitoId() })
          // mixpanel.track(mixPanelData.events.SIGN_IN)

          const accountRoute = ROUTES.account.root.href

          if (response.data.userType === ACCOUNT_TYPES.careGiver) {
            const path = beforeLoginUrl ?? accountRoute + ROUTES.account.caregiverDashboard.href
            handleNavigation(path)
          }
          else {
            const path = beforeLoginUrl ?? accountRoute + ROUTES.account.dashboard.href
            handleNavigation(path)
          }
        }
      }
      else {
        if (response.error?.apiError?.error === 'You are not authorized to complete this request') {
          setError('Invalid username or password')
        }
        else {
          setError(response.error?.apiError?.error || 'An error occurred during login')
        }
      }
    }
    catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=":uno: w-full text-start space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className=":uno: text-red-500">{error}</div>}
        <Button type="submit" variant="login" className=":uno: w-full" disabled={isLoading}>
          {isLoading
            ? (
                <span className=":uno: mx-2" role="status" aria-hidden="true" />
              )
            : (
                'Login'
              )}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
