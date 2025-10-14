/**
 * Generates a random integer within a specified range.
 * @param range The upper bound of the range (exclusive).
 * @returns A random integer within the specified range.
 */
export function GetRandomInteger(range: number): number {
  const max_range = 256
  const byteArray = new Uint8Array(1)
  window.crypto.getRandomValues(byteArray)
  if (byteArray[0] >= Math.floor(max_range / range) * range)
    return GetRandomInteger(range)
  return byteArray[0] % range
}

/**
 * Generates a random string of specified length.
 * @param length The length of the random string to generate.
 * @returns A random string of the specified length.
 */
export function GenerateRandomString(length: number): string {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(GetRandomInteger(possible.length - 1))
  }
  return text
}

/**
 * Generates a code challenge from a code verifier.
 * @param codeVerifier The code verifier string.
 * @returns A Promise that resolves to the generated code challenge.
 */
export async function GenerateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(codeVerifier)
  const hash = await window.crypto.subtle.digest('SHA-256', bytes)
  const hashArray = Array.from(new Uint8Array(hash))
  const hashString = String.fromCharCode.apply(null, hashArray)
  const base64 = btoa(hashString)
  return base64
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}
