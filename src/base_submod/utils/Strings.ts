/**
 * Capitalizes the first letter of each word in a given string.
 * @param str - The string to capitalize. Can be undefined.
 * @returns The capitalized string, or an empty string if the input is undefined or empty.
 */
export function CapitalizeString(str: string | undefined): string {
  if (!str)
    return ''
  return str.trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

/**
 * Fixes joined words separated by commas without spaces.
 * @param str - The string to fix.
 * @returns The string with proper comma separation.
 */
export function FixJoinedCommas(str: string | undefined): string {
  if (!str)
    return ''
  return str.replace(/,(\w)/g, ', $1')
}
