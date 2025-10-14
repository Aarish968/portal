import axios from 'axios'
import { GetAuthTokenFromStorage } from '../LocalStorage'
import { IsInPreviewMode } from '../App'
import ROUTES from '../../../data/routing/routes'
import type { ResponseBody } from './BaseAPI'
import { Del, Get, Post, Put } from './BaseAPI'
import { TokenManager } from '@/base_submod/utils/api/TokenManager'

interface ApiCallOptions {
  path: string
  requestType: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  responseMapFunction?: (data: unknown, param?: unknown) => unknown
  paramToPassInMapFunction?: unknown
  callback?: (data: unknown, response: ApiResponse, param?: unknown) => void
  retry?: number
  currentRetry?: number
  [key: string]: unknown
}

interface ApiResponse {
  success: boolean
  data?: unknown
  error?: {
    errorCode: number
    message: string
    apiError: unknown
  }
  isLoading?: boolean
}

/**
 * Makes an API call with retry and token refresh capabilities
 * @param options - The options for the API call
 * @returns A Promise that resolves to the API response
 */
export async function ApiCall(options: ApiCallOptions): Promise<ApiResponse> {
  const { path, requestType, retry = 0, ...rest } = options
  const props = { ...rest }

  if (IsInPreviewMode() && props.body && typeof props.body === 'object') {
    (props.body as Record<string, unknown>).carereceiverId = sessionStorage.getItem('careReceiverUUID')
  }

  let lastResponse: ApiResponse | null = null

  for (let attempts = 0; attempts <= retry; attempts++) {
    try {
      const response = await executeApiCall({ path, requestType, ...props })
      const apiResponse = handleApiResponse(response)
      lastResponse = apiResponse

      if (apiResponse.success) {
        return apiResponse
      }
      else if (apiResponse.error?.errorCode === 401 && !path.endsWith('login')) {
        const retryResponse = await processUnAuthResponse({ requestType, path, apiResponse, ...props })
        if (retryResponse.success) {
          return retryResponse
        }
        lastResponse = retryResponse
      }
      else if (attempts < retry) {
        continue
      }
      else {
        return apiResponse
      }
    }
    catch (error) {
      if (attempts === retry) {
        return handleApiError(error)
      }
    }
  }

  return lastResponse || {
    success: false,
    error: {
      errorCode: 500,
      message: 'Unexpected end of ApiCall function',
      apiError: 'No response after all retries',
    },
    isLoading: false,
  }
}

/**
 * Executes an API call based on the request type
 * @param options - The options for the API call
 * @returns A Promise that resolves to the response body
 */
async function executeApiCall(options: ApiCallOptions): Promise<ResponseBody> {
  const { path, requestType, ...props } = options
  switch (requestType) {
    case 'GET':
      return Get({ path, ...props })
    case 'POST':
      return Post({ path, ...props })
    case 'DELETE':
      return Del({ path, ...props })
    case 'PUT':
      return Put({ path, ...props })
    default:
      throw new Error('Invalid request type')
  }
}

/**
 * Manages the API response, including mapping and callback handling
 * @param options - The options for managing the API response
 * @param options.path - The API endpoint path
 * @param options.apiResponse - The initial API response
 * @param options.responseMapFunction - Optional function to map the response data
 * @param options.paramToPassInMapFunction - Optional parameter to pass to the map function
 * @param options.callback - Optional callback function to handle the response
 * @param options.requestType - The type of the request (GET, POST, etc.)
 * @returns A Promise that resolves to the processed API response
 */
async function manageAPIResponse({ path, apiResponse, responseMapFunction, paramToPassInMapFunction, callback, requestType, ...props }: ApiCallOptions & { apiResponse: ApiResponse }): Promise<ApiResponse> {
  let { currentRetry, retry } = props
  if (apiResponse.success) {
    let resData: unknown
    if (responseMapFunction) {
      resData = paramToPassInMapFunction ? responseMapFunction(apiResponse.data, paramToPassInMapFunction) : responseMapFunction(apiResponse.data)
    }
    else {
      resData = apiResponse.data
    }
    if (callback)
      callback(resData, apiResponse, paramToPassInMapFunction)
    return { ...apiResponse, data: resData }
  }
  else if (apiResponse.error?.errorCode === 401 && !path.endsWith('login')) {
    const resData = await processUnAuthResponse({
      requestType,
      path,
      apiResponse,
      ...props,
    })
    return resData
  }
  else if (retry) {
    currentRetry = (currentRetry || 1) + 1
    if (currentRetry <= retry) {
      props.currentRetry = currentRetry
      props.retry = retry
      return ApiCall({ path, requestType, ...props })
    }
    else {
      return apiResponse
    }
  }
  else {
    return apiResponse
  }
}

/**
 * Processes unauthorized responses, attempting to refresh the token
 * @param options - The options for processing the unauthorized response
 * @param options.requestType - The type of the request (GET, POST, etc.)
 * @param options.path - The API endpoint path
 * @param options.apiResponse - The initial API response
 * @returns A Promise that resolves to the API response after token refresh attempt
 */
async function processUnAuthResponse({ requestType, path, apiResponse, ...props }: ApiCallOptions & { apiResponse: ApiResponse }): Promise<ApiResponse> {
  const tokenManager = TokenManager.getInstance()
  if (tokenManager.isFetchingNewToken()) {
    return waitUntil({ path, requestType, ...props })
  }
  else if (!tokenManager.isTokenUpdated()) {
    tokenManager.setFetchingNewToken(true)
    await updateAccessToken()
    const newToken = GetAuthTokenFromStorage()
    if (newToken !== '') {
      const header = {
        ...props,
        header: {
          Authorization: `Bearer ${newToken}`,
        },
      }
      return ApiCall({ path, requestType, ...header })
    }
    else {
      if (import.meta.env.MODE === 'test') {
        return ApiCall({ path, requestType, ...props })
      }
      if (import.meta.env.MODE === 'development') {
        return {
          success: false,
          error: {
            errorCode: 401,
            message: 'Failed to update token',
            apiError: 'Token refresh failed',
          },
          isLoading: false,
        }
      }

      window.location.href = ROUTES.auth.login.href
      return apiResponse
    }
  }
  else {
    tokenManager.setTokenUpdated(false)
    return ApiCall({ path, requestType, ...props })
  }
}

/**
 * Updates the access token using the refresh token
 */
export async function updateAccessToken(): Promise<void> {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const user = localStorage.getItem('user')
  const refresh_token = user ? JSON.parse(user).RefreshToken : null
  const data = {
    grant_type: 'refresh_token',
    refresh_token,
    client_id: import.meta.env.VITE_APP_COGNITO_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_APP_COGNITO_REDIRECT_URL,
  }

  try {
    const response = await axios.post<Record<string, string>>(import.meta.env.VITE_APP_COGNIT_OAUTH_URL, data, { headers })

    const mapping: { [key: string]: string } = {
      id_token: 'IdToken',
      access_token: 'AccessToken',
      expires_in: 'ExpiresIn',
      token_type: 'TokenType',
    }

    const mappedResponse = Object.keys(response.data).reduce((acc: Record<string, string>, key) => {
      if (mapping[key]) {
        acc[mapping[key]] = response.data[key]
      }
      return acc
    }, {})

    if (user) {
      mappedResponse.RefreshToken = JSON.parse(user).RefreshToken
    }

    localStorage.setItem('user', JSON.stringify(mappedResponse))
    TokenManager.getInstance().setFetchingNewToken(false)
    TokenManager.getInstance().setTokenUpdated(true)
  }
  catch (e) {
    localStorage.removeItem('user')
    console.error('Error updating access token:', e)
  }
}

/**
 * Waits until a new token is fetched before retrying the API call
 * @param options - The options for the API call
 * @param options.path - The API endpoint path
 * @param options.requestType - The type of the request (GET, POST, etc.)
 * @returns A Promise that resolves to the API response after waiting for the new token
 */
async function waitUntil({ path, requestType, ...props }: ApiCallOptions): Promise<ApiResponse> {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (!TokenManager.getInstance().isFetchingNewToken()) {
        const token = GetAuthTokenFromStorage()
        if (token) {
          const header = {
            ...props,
            header: {
              Authorization: `Bearer ${token}`,
            },
          }
          clearInterval(interval)
          ApiCall({ path, requestType, ...header })
            .then((res) => {
              resolve(res)
            })
            .catch((e) => {
              reject(e)
            })
        }
        clearInterval(interval)
      }
    }, 500)
  })
}

/**
 * Handles the API response, determining success or failure
 * @param responseData - The raw response data from the API
 * @returns The processed API response
 */
function handleApiResponse(responseData: ResponseBody): ApiResponse {
  if (responseData.status >= 200 && responseData.status < 300) {
    return { success: true, data: responseData.data, isLoading: false }
  }
  else {
    return {
      success: false,
      error: {
        errorCode: responseData.status,
        message: getErrorMessage(responseData.data),
        apiError: getApiError(responseData.data),
      },
      isLoading: false,
    }
  }
}

function getErrorMessage(data: unknown): string {
  if (typeof data === 'object' && data !== null) {
    return (data as any).apiError?.message || (data as any).message || 'Unknown error'
  }
  return 'Unknown error'
}

function getApiError(data: unknown): unknown {
  if (typeof data === 'object' && data !== null) {
    return (data as any).apiError || data
  }
  return data
}

function handleApiError(error: unknown): ApiResponse {
  return {
    success: false,
    error: {
      errorCode: (error as { status?: number }).status || 500,
      message: getErrorMessage(error),
      apiError: getApiError(error),
    },
    isLoading: false,
  }
}

/**
 * Makes a GET API call
 * @param options - The options for the GET API call
 * @param options.path - The API endpoint path
 * @param options.requestType - The type of the request (GET)
 * @returns A Promise that resolves to the API response
 */
export async function GetApiCall({ path, requestType, ...props }: ApiCallOptions): Promise<ApiResponse> {
  return Get({ path, ...props })
    .then((responseData) => {
      const apiResponse = handleApiResponse(responseData)
      return manageAPIResponse({ path, apiResponse, requestType, ...props })
    })
    .catch((e) => {
      return handleApiError(e)
    })
}

/**
 * Makes a POST API call
 * @param options - The options for the POST API call
 * @param options.path - The API endpoint path
 * @param options.body - The request body
 * @param options.requestType - The type of the request (POST)
 * @returns A Promise that resolves to the API response
 */
export async function PostApiCall({ path, body, requestType, ...props }: ApiCallOptions): Promise<ApiResponse> {
  return Post({ path, body, ...props })
    .then((responseData) => {
      const apiResponse = handleApiResponse(responseData)
      return manageAPIResponse({ path, apiResponse, requestType, ...props })
    })
    .catch((e) => {
      return handleApiError(e)
    })
}

/**
 * Makes a DELETE API call
 * @param options - The options for the DELETE API call
 * @param options.path - The API endpoint path
 * @param options.requestType - The type of the request (DELETE)
 * @returns A Promise that resolves to the API response
 */
export async function DeleteApiCall({ path, requestType, ...props }: ApiCallOptions): Promise<ApiResponse> {
  return Del({ path, ...props })
    .then((responseData) => {
      const apiResponse = handleApiResponse(responseData)
      return manageAPIResponse({ path, apiResponse, requestType, ...props })
    })
    .catch((e) => {
      return handleApiError(e)
    })
}

/**
 * Makes a PUT API call
 * @param options - The options for the PUT API call
 * @param options.path - The API endpoint path
 * @param options.body - The request body
 * @param options.requestType - The type of the request (PUT)
 * @returns A Promise that resolves to the API response
 */
export async function PutApiCall({ path, body, requestType, ...props }: ApiCallOptions): Promise<ApiResponse> {
  return Put({ path, body, ...props })
    .then((responseData) => {
      const apiResponse = handleApiResponse(responseData)
      return manageAPIResponse({ path, apiResponse, requestType, ...props })
    })
    .catch((e) => {
      return handleApiError(e)
    })
}
