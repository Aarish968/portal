import { GetLocalStorageData } from '../LocalStorage'

// There is lots of Data in some API so we need to add more timeout here
const TIMEOUT = 60000
interface RequestOptions {
  method: string
  path: string
  body?: unknown
  header?: HeadersInit
}

export interface ResponseBody {
  status: number
  data: unknown
}

interface ApiResponse {
  status: number
  headers: Headers
  body: ResponseBody | null
}

interface UserData {
  authToken?: string
  [key: string]: unknown
}

/**
 * GET a path relative to API root url.
 * @param options - The options for the GET request
 * @param options.path - Relative path to the configured API endpoint
 * @param options.props - Additional properties to be passed to the request
 * @returns A Promise that resolves to the response body
 */
export function Get({ path, ...props }: Omit<RequestOptions, 'method' | 'body'>): Promise<ResponseBody> {
  return BodyOf(Request({ method: 'get', path, body: null, ...props }))
}

/**
 * POST JSON to a path relative to API root url
 * @param options - The options for the POST request
 * @param options.path - Relative path to the configured API endpoint
 * @param options.body - Anything that you can pass to JSON.stringify
 * @param options.props - Additional properties to be passed to the request
 * @returns A Promise that resolves to the response body
 */
export function Post({ path, body, ...props }: Omit<RequestOptions, 'method'>): Promise<ResponseBody> {
  return BodyOf(Request({ method: 'post', path, body, ...props }))
}

/**
 * PUT JSON to a path relative to API root url
 * @param options - The options for the PUT request
 * @param options.path - Relative path to the configured API endpoint
 * @param options.body - Anything that you can pass to JSON.stringify
 * @param options.props - Additional properties to be passed to the request
 * @returns A Promise that resolves to the response body
 */
export function Put({ path, body, ...props }: Omit<RequestOptions, 'method'>): Promise<ResponseBody> {
  return BodyOf(Request({ method: 'put', path, body, ...props }))
}

/**
 * DELETE a path relative to API root url
 * @param options - The options for the DELETE request
 * @param options.path - Relative path to the configured API endpoint
 * @param options.props - Additional properties to be passed to the request
 * @returns A Promise that resolves to the response body
 */
export function Del({ path, ...props }: Omit<RequestOptions, 'method' | 'body'>): Promise<ResponseBody> {
  return BodyOf(Request({ method: 'delete', path, body: null, ...props }))
}

/**
 * Make arbitrary fetch request to a path relative to API root url
 * @param options - The options for the request
 * @param options.method - One of: get|post|put|delete
 * @param options.path - Relative path to the configured API endpoint
 * @param options.body - Anything that you can pass to JSON.stringify
 * @param options.props - Additional properties to be passed to the request
 * @returns A Promise that resolves to the API response
 */
export async function Request({ method, path, body, ...props }: RequestOptions): Promise<ApiResponse> {
  const response = await sendRequest({ method, path, body, ...props })
  return handleResponse(path, response)
}

/**
 * Takes a relative path and makes it a full URL to API server
 * @param path - Relative path to the configured API endpoint
 * @returns The full URL to the API server
 */
export function Url(path: string): string {
  return path
}

/**
 * Constructs and fires a HTTP request
 */
function sendRequest({ method, path, body, ...props }: RequestOptions): Promise<Response> {
  try {
    const endpoint = Url(path)
    const headers = props.header ? props.header : getRequestHeaders(body)
    const options: RequestInit = body
      ? { method, headers, body: JSON.stringify(body) }
      : { method, headers }

    return timeout(fetch(endpoint, options), TIMEOUT)
  }
  catch (e) {
    throw new Error(String(e))
  }
}

/**
 * Receives and reads a HTTP response
 */
async function handleResponse(_path: string, response: Response): Promise<ApiResponse> {
  const responseBody = await response.text()
  const responseBodyJson: ResponseBody = {
    status: response.status,
    data: null,
  }

  if (responseBody) {
    responseBodyJson.data = JSON.parse(responseBody)
  }

  return {
    status: response.status,
    headers: response.headers,
    body: responseBodyJson,
  }
}

function getRequestHeaders(body: unknown): HeadersInit {
  const headers: HeadersInit = body
    ? { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    : { Accept: 'application/json' }

  const userData = GetLocalStorageData('__VU__')

  if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
    const typedUserData = userData as UserData
    if ('authToken' in typedUserData && typeof typedUserData.authToken === 'string') {
      headers.Authorization = `Bearer ${typedUserData.authToken}`
    }
  }

  return headers
}

/**
 * Rejects a promise after `ms` number of milliseconds, if it is still pending
 * @param promise - The promise to apply the timeout to
 * @param ms - The number of milliseconds to wait before timing out
 * @returns A Promise that resolves to the original promise result or rejects with a timeout error
 */
function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise
      .then((response) => {
        clearTimeout(timer)
        resolve(response)
      })
      .catch(reject)
  })
}

/**
 * Extracts the body from an API response
 * @param requestPromise - The promise of an API response
 * @returns A Promise that resolves to the response body
 */
async function BodyOf(requestPromise: Promise<ApiResponse>): Promise<ResponseBody> {
  const response = await requestPromise
  return response.body as ResponseBody
}
