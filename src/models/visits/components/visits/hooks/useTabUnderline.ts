import { useState, useEffect, useRef } from 'react'
import { TabType } from '../types'

export function useTabUnderline(activeTab: TabType) {
  const todayTabRef = useRef<HTMLButtonElement>(null)
  const tomorrowTabRef = useRef<HTMLButtonElement>(null)
  const weekTabRef = useRef<HTMLButtonElement>(null)
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 })

  useEffect(() => {
    const updateUnderlinePosition = () => {
      let targetRef = todayTabRef
      if (activeTab === 'tomorrow') targetRef = tomorrowTabRef
      if (activeTab === 'week') targetRef = weekTabRef

      if (targetRef.current) {
        const { offsetLeft, offsetWidth } = targetRef.current
        setUnderlineStyle({ width: offsetWidth, left: offsetLeft })
      }
    }

    updateUnderlinePosition()
    window.addEventListener('resize', updateUnderlinePosition)
    return () => window.removeEventListener('resize', updateUnderlinePosition)
  }, [activeTab])

  return { todayTabRef, tomorrowTabRef, weekTabRef, underlineStyle }
}
