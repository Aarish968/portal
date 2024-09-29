import { useEffect } from 'react'
import { Button } from '@/base_submod/components/ui/button'
import PorterLogo from '@/base_submod/assets/images/logo/porter-logo-vertical.svg'
import { useLogout } from '@/models/auth/hooks/useLogout'

function LogoutView() {
  const logout = useLogout()

  useEffect(() => {
    logout()
  }, [logout])

  return (
    <section className=":uno: relative grid grid-cols-1 min-h-screen gap-4 px-7 py-6 lg:grid-cols-2 lg:px-4">
      <div className=":uno: grid grid-cols-1">
        <div />
        <div className=":uno: mx-auto mt-8 flex-col-center flex-grow text-center lg:mt-0 space-y-6">
          <img src={PorterLogo} alt="Porter Logo" />
          <div className=":uno: space-y-1">
            <h1>Logging Out</h1>
            <p className=":uno: text-#212529 leading-26px font-hind">
              Please wait while we securely log you out of your account
            </p>
          </div>
          <div className=":uno: h-32 w-32 animate-spin border-b-2 border-t-2 border-#886aaf rounded-full"></div>
        </div>
        <div className=":uno: mt-auto h-full flex flex-col justify-between">
          <div className=":uno: flex flex-col-center md:flex-row md:space-x-1">
            <div className=":uno: font-primary mt-.5 font-medium">Need to log in again?</div>
            <Button
              variant="loginFooterLink"
              size="link"
              className=":uno: underline !font-semibold"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
      <div className=":uno: pp-login-imageWrap my-auto hidden lg:block"></div>
      <div className=":uno: fixed bottom-2 right-2">
        <Button size="lg">Contact Us</Button>
      </div>
    </section>
  )
}

export default LogoutView
