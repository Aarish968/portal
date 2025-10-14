import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export interface TokenResponse {
  id_token?: string
  access_token?: string
  expires_in?: string
  token_type?: string
}

export interface MappedResponse {
  IdToken?: string
  AccessToken?: string
  ExpiresIn?: string
  TokenType?: string
  RefreshToken?: string
}

type TokenData = {
  grant_type: string
  client_id: string
  redirect_uri: string
} & (
  | { grant_type: 'authorization_code', code: string, code_verifier: string }
  | { grant_type: 'refresh_token', refresh_token: string }
  )

export const CODE_VERIFIER_STORAGE_KEY = 'PKCE_code_verifier'

/**
 * Checks if the user's token is valid and not expired.
 * @returns {boolean} True if the token is valid and not expired, false otherwise.
 */
export function IsValidToken() {
  const user = localStorage.getItem('user')

  if (user === null || user === '') {
    return false
  }

  const token = JSON.parse(user)?.AccessToken
  if (token && token !== '') {
    try {
      const decodedToken = jwtDecode(token)
      return decodedToken.exp && decodedToken.exp * 1000 > Date.now()
    }
    catch (error) {
      // toast.error(error)
      console.error('error occured in IsValidToken: ', error)
      return false
    }
  }
  return false
}

/**
 * Prepares the token request data based on the grant type.
 * @param {string} search - The search string containing the authorization code.
 * @param {'authorization_code' | 'refresh_token'} grant_type - The type of grant to request.
 * @returns {Promise<TokenData>} A promise that resolves to the prepared token data.
 * @throws {Error} If required data is missing.
 */
export async function PrepareTokenRequestData(search: string, grant_type: 'authorization_code' | 'refresh_token' = 'authorization_code'): Promise<TokenData> {
  const searchParams = new URLSearchParams(search)
  const code = searchParams.get('code')
  const verifier = sessionStorage.getItem(CODE_VERIFIER_STORAGE_KEY)

  if (grant_type === 'authorization_code') {
    if (code === null)
      throw new Error('Code is missing from search params')
    if (verifier === null)
      throw new Error('Code verifier is missing from session storage')

    return {
      grant_type,
      code,
      client_id: import.meta.env.VITE_APP_COGNITO_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_APP_COGNITO_REDIRECT_URL,
      code_verifier: verifier,
    }
  }
  else {
    const user = localStorage.getItem('user')
    if (user === null)
      throw new Error('User data is missing from local storage')

    const userData = JSON.parse(user)
    if (typeof userData.RefreshToken !== 'string')
      throw new Error('Refresh token is missing or invalid')

    return {
      grant_type,
      refresh_token: userData.RefreshToken,
      client_id: import.meta.env.VITE_APP_COGNITO_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_APP_COGNITO_REDIRECT_URL,
    }
  }
}

/**
 * Sends a request to the authorization server to obtain tokens.
 * @param {TokenData} authorizationData - The data required for the token request.
 * @returns {Promise<AxiosResponse<TokenResponse>>} A promise that resolves to the token response.
 */
export async function RequestTokens(authorizationData: TokenData) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const response = await axios.post<TokenResponse>(
    import.meta.env.VITE_APP_COGNIT_OAUTH_URL,
    authorizationData,
    { headers },
  )

  return response
}

/**
 * Maps the token response to a standardized format and stores it in local storage.
 * @param {TokenResponse} responseData - The token response from the authorization server.
 * @returns {MappedResponse} The mapped and stored token data.
 */
export function MapAndStoreTokens(responseData: TokenResponse): MappedResponse {
  const mapping: Record<keyof TokenResponse, keyof MappedResponse> = {
    id_token: 'IdToken',
    access_token: 'AccessToken',
    expires_in: 'ExpiresIn',
    token_type: 'TokenType',
  }

  const mappedResponse = Object.entries(responseData).reduce<MappedResponse>((acc, [key, value]) => {
    const mappedKey = mapping[key as keyof TokenResponse]
    if (mappedKey) {
      acc[mappedKey] = value
    }
    return acc
  }, {})

  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser) as { RefreshToken?: string }
    if (parsedUser.RefreshToken) {
      mappedResponse.RefreshToken = parsedUser.RefreshToken
    }
  }

  localStorage.setItem('user', JSON.stringify(mappedResponse))

  return mappedResponse
}
