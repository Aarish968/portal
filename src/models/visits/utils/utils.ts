import { Visit } from '../types/types'

export const cn = (...classes: (string | false | null | undefined)[]) => 
  classes.filter(Boolean).join(' ')

export const groupVisitsByDate = (visits: Visit[]): Record<string, Visit[]> => {
  return visits.reduce((acc: Record<string, Visit[]>, v) => {
    const key = v.date || 'Today'
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {})
}

export const getHeaderHeight = (viewportWidth: number): number => {
  const isVerySmallMobile = viewportWidth <= 389
  const isSmallMobile = viewportWidth >= 390 && viewportWidth <= 638
  
  if (isVerySmallMobile || isSmallMobile) {
    return 220
  }
  return 135
}
