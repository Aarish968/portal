/**
 * Encrypts data by stringifying, encoding, and then base64 encoding it.
 * @param value - The value to encrypt.
 * @returns The encrypted string.
 */
export function EncryptData(value: unknown): string {
  return window.btoa(escape(encodeURIComponent(JSON.stringify(value))))
}

/**
 * Decrypts a previously encrypted string.
 * @param value - The encrypted string to decrypt.
 * @returns The decrypted string.
 */
export function DecryptData(value: string): string {
  return decodeURIComponent(unescape(window.atob(value)))
}

/**
 * Sets an item in local storage after encrypting it.
 * @param key - The key under which to store the value.
 * @param value - The value to store.
 */
export function SetLocalStorageData(key: string, value: unknown): void {
  const encryptValue = EncryptData(value)
  localStorage.setItem(key, encryptValue)
}

/**
 * Retrieves and decrypts an item from local storage.
 * @param key - The key of the item to retrieve.
 * @returns The decrypted value, or an empty string if decryption fails.
 */
export function GetLocalStorageData(key: string): unknown {
  const encryptDataValue = localStorage.getItem(key)
  if (encryptDataValue === null) {
    return ''
  }

  try {
    return JSON.parse(DecryptData(encryptDataValue))
  }
  catch {
    return ''
  }
}

/**
 * Clears all items from local storage.
 */
export function ClearAllLocalStorage(): void {
  localStorage.clear()
}

/**
 * Retrieves the authentication token from local storage.
 * @returns The authentication token as a string, or an empty string if not found or in case of an error.
 */
export function GetAuthTokenFromStorage(): string {
  try {
    const userData = localStorage.getItem('user')
    if (!userData)
      return ''

    const parsedUserData = JSON.parse(userData)
    return parsedUserData.AccessToken || ''
  }
  catch (error) {
    if (import.meta.env.MODE !== 'test') {
      console.error('Error parsing user data from localStorage:', error)
    }
    return ''
  }
}
