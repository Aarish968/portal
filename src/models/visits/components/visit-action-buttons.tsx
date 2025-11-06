import { Pencil } from 'lucide-react'
import { VisitStatus } from '../types'

interface VisitActionButtonsProps {
  status: VisitStatus
  needsSaving: boolean
  isSaving: boolean
  isReopening: boolean
  onSave: () => void
  onEdit: () => void
}

export function VisitActionButtons({
  status,
  needsSaving,
  isSaving,
  isReopening,
  onSave,
  onEdit
}: VisitActionButtonsProps) {
  // Don't render anything during loading states
  if (isSaving || isReopening) {
    return null
  }

  // Completed state - show edit button
  if (status === 'completed') {
    return (
      <button
        onClick={onEdit}
        className="inline-flex items-center justify-center px-6 py-2 min-h-10 bg-transparent text-purple-600 border border-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition-colors"
      >
        <Pencil className="w-4 h-4 mr-2" />
        Edit
      </button>
    )
  }

  // Ready to save or needs saving - show save button
  if (status === 'ready-to-save' || needsSaving) {
    return (
      <button
        onClick={onSave}
        className="inline-flex items-center justify-center px-6 py-2 min-h-10 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 transition-colors"
      >
        Save
      </button>
    )
  }

  return null
}