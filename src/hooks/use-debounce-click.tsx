import { useEffect, useRef, useState } from 'react'

export function useDebounceClick(onClick: () => void, debounceTime = 400, maxDebounceTime = 5000) {
  const [isDebouncing, setIsDebouncing] = useState(false)
  const timeoutRef = useRef<number>()

  const resetDebounce = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    setIsDebouncing(false)
    timeoutRef.current = undefined
  }

  useEffect(() => {
    return () => resetDebounce()
  }, [])

  const handleClick = () => {
    if (!isDebouncing) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      setIsDebouncing(true)

      try {
        onClick()
      }
      catch (error) {
        console.error('Error in click handler:', error)
        resetDebounce()
        return
      }

      timeoutRef.current = window.setTimeout(resetDebounce, debounceTime)
      window.setTimeout(resetDebounce, maxDebounceTime)
    }
  }

  return { handleClick, isDebouncing }
}
