import { useCallback, useEffect, useRef } from 'react'
import { TabType, Visit } from '../types/types'
import { getHeaderHeight } from '../utils/utils'

export function useStickyDateCards(
  activeTab: TabType,
  groupedVisits: Record<string, Visit[]>
) {
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const dateSectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleScroll = useCallback(() => {
    if (activeTab !== 'week' && activeTab !== 'past') return

    try {
      const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth)
      const isMobile = viewportWidth < 640
      const headerHeight = getHeaderHeight(viewportWidth)

      const sortedEntries = Object.entries(groupedVisits).sort((a, b) => {
        const aElement = dateSectionRefs.current[a[0]]
        const bElement = dateSectionRefs.current[b[0]]
        if (!aElement || !bElement) return 0
        return aElement.getBoundingClientRect().top - bElement.getBoundingClientRect().top
      })

      sortedEntries.forEach(([date]) => {
        const dateElement = dateRefs.current[date]
        const dateSectionElement = dateSectionRefs.current[date]

        if (!dateElement || !dateSectionElement) return

        const wrapper = dateElement.parentElement

        dateElement.style.position = ''
        dateElement.style.top = ''
        dateElement.style.left = ''
        dateElement.style.width = ''
        dateElement.style.zIndex = ''
        dateElement.style.marginBottom = ''
        if (wrapper) wrapper.style.height = ''
      })

      let activeDateCard = null

      for (let i = 0; i < sortedEntries.length; i++) {
        const [date] = sortedEntries[i]
        const dateElement = dateRefs.current[date]
        const dateSectionElement = dateSectionRefs.current[date]

        if (!dateElement || !dateSectionElement) continue

        const whiteContainer = dateSectionElement.querySelector('.bg-white.rounded-lg')
        if (!whiteContainer) continue

        if (!dateElement.dataset.originalHeight) {
          dateElement.dataset.originalHeight = dateElement.offsetHeight.toString()
        }
        const originalHeight = parseInt(dateElement.dataset.originalHeight)

        const sectionRect = dateSectionElement.getBoundingClientRect()
        const containerRect = whiteContainer.getBoundingClientRect()

        const sectionTop = sectionRect.top
        const containerBottom = containerRect.bottom

        if (sectionTop <= headerHeight && containerBottom > headerHeight) {
          activeDateCard = { date, dateElement, dateSectionElement, whiteContainer, originalHeight, index: i }
          break
        }
      }

      if (activeDateCard) {
        const { dateElement, whiteContainer, originalHeight, index } = activeDateCard
        const wrapper = dateElement.parentElement

        const containerRect = whiteContainer.getBoundingClientRect()
        const containerBottom = containerRect.bottom
        const zIndex = 10 + index
        const dateCardBottom = headerHeight + originalHeight

        if (containerBottom > dateCardBottom) {
          dateElement.style.position = 'fixed'
          dateElement.style.top = `${headerHeight}px`
        } else {
          dateElement.style.position = 'fixed'
          dateElement.style.top = `${containerBottom - originalHeight}px`
        }

        if (isMobile) {
          dateElement.style.width = `${containerRect.width}px`
          dateElement.style.left = `${containerRect.left}px`
        } else {
          dateElement.style.left = `${containerRect.left}px`
          dateElement.style.width = `${containerRect.width}px`
        }

        dateElement.style.zIndex = zIndex.toString()
        dateElement.style.marginBottom = '0'
        if (wrapper) wrapper.style.height = `${originalHeight}px`
      }
    } catch (error) {
      console.error('Scroll error:', error)
    }
  }, [activeTab, groupedVisits])

  useEffect(() => {
    let ticking = false

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    if (activeTab === 'week' || activeTab === 'past') {
      handleScroll()

      window.addEventListener('scroll', throttledHandleScroll, { passive: true })
      window.addEventListener('resize', throttledHandleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', throttledHandleScroll)
        window.removeEventListener('resize', throttledHandleScroll)

        Object.values(dateRefs.current).forEach(element => {
          if (element) {
            const wrapper = element.parentElement

            element.style.position = ''
            element.style.top = ''
            element.style.zIndex = ''
            element.style.width = ''
            element.style.left = ''
            element.style.right = ''
            element.style.maxWidth = ''
            element.style.margin = ''
            element.style.marginBottom = ''
            element.style.transition = 'none'

            if (wrapper) wrapper.style.height = ''
          }
        })
      }
    } else {
      Object.values(dateRefs.current).forEach(element => {
        if (element) {
          const wrapper = element.parentElement

          element.style.position = ''
          element.style.top = ''
          element.style.zIndex = ''
          element.style.width = ''
          element.style.left = ''
          element.style.right = ''
          element.style.maxWidth = ''
          element.style.margin = ''
          element.style.marginBottom = ''
          element.style.transition = 'none'

          if (wrapper) wrapper.style.height = ''
        }
      })
    }
  }, [activeTab, handleScroll])

  return { dateRefs, dateSectionRefs }
}
