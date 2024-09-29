import { Button } from '@/base_submod/components/ui/button'
import PorterLogo from '@/base_submod/assets/images/logo/porter-logo-vertical.svg'
import LoginForm from '@/models/auth/components/login-form'
import LoginFooterLink from '@/models/auth/components/login-footer-link'

function LoginView() {
  return (
    <section className=":uno: relative grid grid-cols-1 min-h-screen gap-4 px-7 py-6 lg:grid-cols-2 lg:px-4">
      <div className=":uno: grid grid-cols-1">
        <div />
        <div className=":uno: mx-auto mt-8 flex-col-center flex-grow text-center lg:mt-0 space-y-6">
          <img src={PorterLogo} alt="Porter Logo" />
          <div className=":uno: space-y-1">
            <h1>Welcome Back</h1>
            <p className=":uno: text-#212529 leading-26px font-hind">
              Please enter the information below to sign into your account
            </p>
          </div>
          <LoginForm />
          <div className=":uno: mt-12 flex flex-col items-center text-21px leading-33px font-hind md:flex-row md:space-x-1">
            <div>Forgot your password?</div>
            <Button variant="link" className=":uno: text-#886aaf !text-21px">
              Click here
            </Button>
          </div>
        </div>
        <div className=":uno: mt-auto h-full flex flex-col justify-between">
          <div className=":uno: flex flex-col-center md:flex-row md:space-x-1">
            <div className=":uno: font-primary mt-.5 font-medium">Don't have an account?</div>
            <Button
              variant="loginFooterLink"
              size="link"
              className=":uno: underline !font-semibold"
            >
              Sign up
            </Button>
          </div>
          <div className=":uno: grid grid-cols-1 gap-1 pb-8 md:grid-cols-3">
            <LoginFooterLink label="Privacy & Terms" />
            <LoginFooterLink label="Contact us" />
            <LoginFooterLink label="Back to home" />
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

export default LoginView
