import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GenerateCodeChallenge, GenerateRandomString } from '../../../base_submod/utils/Generate'
import { CODE_VERIFIER_STORAGE_KEY, IsValidToken, MapAndStoreTokens, PrepareTokenRequestData, RequestTokens } from '../../../base_submod/utils/JWT'
import ROUTES from '../../../data/routing/routes'

function useAuthentication() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [isCaregiverUser, setIsCaregiverUser] = useState(false)

  useEffect(() => {
    getUserType()
  }, [])

  function getUserType() {
    const userType = localStorage.getItem('userType')
    setIsCaregiverUser(userType === 'Caregiver')
  }

  async function getCustomLoginUrl() {
    const url = ROUTES.auth.login.href
    return url
  }

  function redirectToCustomLogin() {
    navigate(ROUTES.auth.login.href, { replace: true })
  }

  async function redirectToLogin(): Promise<void> {
    const codeVerifier: string = GenerateRandomString(96)
    sessionStorage.setItem(CODE_VERIFIER_STORAGE_KEY, codeVerifier)
    const challenge: string = await GenerateCodeChallenge(codeVerifier)
    const loginUrl = `${import.meta.env.VITE_APP_LOGIN_URL}&code_challenge=${challenge}&code_challenge_method=S256`
    navigate(loginUrl, { replace: true })
  }

  async function getLoginUrl() {
    const codeVerifier = GenerateRandomString(96)
    sessionStorage.setItem(CODE_VERIFIER_STORAGE_KEY, codeVerifier)
    const challenge = await GenerateCodeChallenge(codeVerifier)
    const loginUrl = `${import.meta.env.VITE_APP_LOGIN_URL}&code_challenge=${challenge}&code_challenge_method=S256`
    return loginUrl
  }

  function handleAuthError(): void {
    localStorage.removeItem('user')
    redirectToCustomLogin()
  }

  function updateBrowserHistory(): void {
    navigate(ROUTES.account.dashboard.href, { replace: true })
  }

  async function getToken(): Promise<void> {
    try {
      const authorizationData = await PrepareTokenRequestData(search)
      const response = await RequestTokens(authorizationData)

      if (response.status !== 200) {
        handleAuthError()
        return
      }

      MapAndStoreTokens(response.data)

      updateBrowserHistory()
    }
    catch (e) {
      console.error('Error in getToken:', e)
      handleAuthError()
      throw e
    }
  }

  function deauthenticate() {
    localStorage.removeItem('user')
    localStorage.setItem('ISIDLE', 'true')
    localStorage.setItem('dispatchedLogoutOnIdle', 'true')
    // console.log('Tracking sign out event in mixpanel')
    // mixpanel.track(mixPanelData.events.SIGN_OUT)
    // console.log('Resetting mixpanel')
    // mixpanel.reset()
    navigate(ROUTES.auth.login.href, { replace: true })
  }

  function isValidToken() {
    const result = IsValidToken()
    return result
  }

  return {
    isCaregiverUser,
    isValidToken,
    deauthenticate,
    getToken,
    getLoginUrl,
    getCustomLoginUrl,
    redirectToLogin,
    redirectToCustomLogin,
  }
}

export { useAuthentication }
