import { jwtDecode } from 'jwt-decode'
import { ACCOUNT_TYPES } from '../data/App'
import { GetAuthTokenFromStorage } from './LocalStorage'

/**
 * Determines if the application is in preview mode for caregivers.
 *
 * Preview mode is active when:
 * 1. The user type is set to caregiver in the session storage
 * 2. A care receiver UUID is set and is not empty in the session storage
 *
 * @returns {boolean} True if in preview mode, false otherwise.
 */
export function IsInPreviewMode(): boolean {
  return (
    sessionStorage.getItem('userViewType') === ACCOUNT_TYPES.careGiver
    && sessionStorage.getItem('careReceiverUUID') !== null
    && sessionStorage.getItem('careReceiverUUID') !== ''
  )
}
interface DecodedToken {
  username?: string
  [key: string]: unknown
}

export function GetCognitoId(): string {
  const token = GetAuthTokenFromStorage()

  if (!token) {
    return ''
  }

  try {
    const decodedToken = jwtDecode<DecodedToken>(token)
    return decodedToken.username || ''
  }
  catch (error) {
    console.error('Error decoding token:', error)
    return ''
  }
}
