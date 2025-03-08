export function isValidDateString(str: any): boolean {
  if (typeof str !== 'string')
    return false
  const date = new Date(str)
  return date instanceof Date && !Number.isNaN(date.getTime())
}

export function formatDate(date: Date, format: string): string {
  const fullYear = date.getFullYear()
  const shortYear = String(fullYear).slice(-2)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  switch (format) {
    case 'YYYY-MM-DD':
      return `${fullYear}-${month}-${day}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${fullYear}`
    case 'DD/MM/YYYY':
      return `${day}/${month}/${fullYear}`
    case 'MM-DD-YYYY':
      return `${month}-${day}-${fullYear}`
    case 'DD-MM-YYYY':
      return `${day}-${month}-${fullYear}`
    case 'YY/MM':
      return `${shortYear}/${month}`
    case 'YYYY-MM':
      return `${fullYear}-${month}`
    case 'MM-YYYY':
      return `${month}-${fullYear}`
    case 'YYYY/MM':
      return `${fullYear}/${month}`
    case 'MM/YYYY':
      return `${month}/${fullYear}`
    case 'YY-MM':
      return `${shortYear}-${month}`
    case 'MM/YY':
      return `${month}/${shortYear}`
    default:
      return date.toLocaleDateString('en-US')
  }
}
