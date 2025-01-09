import { useEffect, useRef, useState } from 'react'
import { useBlocker, useNavigate } from 'react-router-dom'
import { useToast } from '@/base_submod/hooks/use-toast'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import { useMemberStore } from '@/models/member/stores/member-store'

interface UseHRABlockerProps {
  shouldBlock: boolean
}

export function useHRABlocker({ shouldBlock }: UseHRABlockerProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const pendingLocationRef = useRef<any>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [blockNavigation, setBlockNavigation] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const selectedMember = useMemberStore(state => state.selectedMember)
  const isCompleted = selectedMember?.isCompleted

  useEffect(() => {
    if (!isNavigating) {
      setBlockNavigation(shouldBlock && !isCompleted)
    }
  }, [shouldBlock, isNavigating, isCompleted])

  useEffect(() => {
    if (isNavigating) {
      setBlockNavigation(false)
    }
  }, [isNavigating])

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (blockNavigation && currentLocation.pathname !== nextLocation.pathname && !isCompleted) {
      pendingLocationRef.current = nextLocation
      setShowConfirmationModal(true)
      return true
    }
    return false
  })

  useEffect(() => {
    if (isNavigating && !blockNavigation && pendingLocationRef.current) {
      const location = pendingLocationRef.current
      const { pathname, search, hash } = location

      pendingLocationRef.current = null
      blocker.reset?.()
      navigate(pathname + search + hash, { replace: true })
      setIsNavigating(false)
      setBlockNavigation(false)
    }
  }, [isNavigating, blockNavigation, navigate, blocker])

  const handleExitWithoutSaving = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const targetLocation = pendingLocationRef.current || { pathname: '/hra-activity', search: '', hash: '' }

    setShowConfirmationModal(false)
    pendingLocationRef.current = targetLocation
    setIsNavigating(true)
  }

  const handleConfirmNavigation = async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const targetLocation = pendingLocationRef.current || { pathname: '/hra-activity', search: '', hash: '' }

    try {
      setIsSaving(true)
      await useHRAStore.getState().saveHRA(true, false)

      setShowConfirmationModal(false)
      pendingLocationRef.current = targetLocation
      setIsNavigating(true)

      toast({
        title: 'Progress Saved',
        duration: 2000,
      })
    }
    catch (error) {
      toast({
        title: 'Failed to save progress',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
        duration: 3000,
      })
      setShowConfirmationModal(false)
      pendingLocationRef.current = null
      setIsNavigating(false)
      blocker.reset?.()
    }
    finally {
      setIsSaving(false)
    }
  }

  const handleCancelNavigation = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setShowConfirmationModal(false)
    pendingLocationRef.current = null
    setIsNavigating(false)
    blocker.reset?.()
  }

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (shouldBlock) {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }
  }

  useEffect(() => {
    if (shouldBlock) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [shouldBlock])

  return {
    showConfirmationModal,
    setShowConfirmationModal,
    handleExitWithoutSaving,
    handleConfirmNavigation,
    handleCancelNavigation,
    setIsNavigating,
    pendingLocationRef,
    isSaving,
  }
}
