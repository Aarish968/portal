/**
 * TOAST TEST COMPONENT - EASY TO REMOVE
 * This component is for testing error toasts on S3 deployment
 * To remove: Delete this file and remove <ForceSaveErrorToggle /> from visit-details-view.tsx
 */

import React from 'react'
import { useToast } from '@/base_submod/hooks/use-toast'

export function useForceSaveError() {
  const [forceSaveError, setForceSaveError] = React.useState(() => {
    return localStorage.getItem('FORCE_SAVE_ERROR') === 'true'
  })

  const toggleForceSaveError = React.useCallback(() => {
    const newValue = !forceSaveError
    localStorage.setItem('FORCE_SAVE_ERROR', String(newValue))
    setForceSaveError(newValue)
    return newValue
  }, [forceSaveError])

  return {
    forceSaveError,
    toggleForceSaveError,
  }
}

interface ForceSaveErrorToggleProps {
  forceSaveError: boolean
  onToggle: () => boolean
}

export function ForceSaveErrorToggle({ forceSaveError, onToggle }: ForceSaveErrorToggleProps) {
  const { toast } = useToast()

  const handleToggle = () => {
    const newValue = onToggle()
    toast({
      title: newValue ? 'Error Flag ON' : 'Error Flag OFF',
      description: newValue 
        ? 'Save errors will be simulated for testing' 
        : 'Save errors disabled',
    })
  }

  return (
    <button
      onClick={handleToggle}
      className="inline-flex items-center justify-center h-8 text-xs font-medium whitespace-nowrap rounded-full px-3 border"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: forceSaveError ? 'rgb(220, 38, 38)' : 'white',
        color: forceSaveError ? 'white' : 'rgb(107, 114, 128)',
        borderColor: forceSaveError ? 'rgb(220, 38, 38)' : 'rgb(229, 231, 235)',
        lineHeight: '1.5',
        cursor: 'pointer',
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      title={forceSaveError ? 'Error Flag: ON - Click to disable' : 'Error Flag: OFF - Click to enable'}
    >
      {forceSaveError ? '🔴 Error ON' : '🟢 Error OFF'}
    </button>
  )
}

