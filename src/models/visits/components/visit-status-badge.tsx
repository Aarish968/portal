import { VisitStatus } from '../types'

interface VisitStatusBadgeProps {
  status: VisitStatus
  isLoading?: boolean
  loadingText?: string
}

const STATUS_CONFIG = {
  'not-started': {
    label: 'Not Started',
    className: 'bg-blue-50 text-gray-900 border-0'
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-orange-500 text-white border-0'
  },
  'ready-to-save': {
    label: 'Ready to Save',
    className: 'bg-blue-50 text-gray-900 border-0'
  },
  'completed': {
    label: 'Completed',
    className: 'bg-teal-600 text-white border-0'
  }
} as const

export function VisitStatusBadge({ status, isLoading, loadingText }: VisitStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  
  if (isLoading && loadingText) {
    return (
      <div className="inline-flex items-center justify-center h-8 text-xs font-medium whitespace-nowrap rounded-full px-3 bg-white text-gray-600 border border-gray-200">
        {loadingText}
      </div>
    )
  }

  return (
    <div className={`inline-flex items-center justify-center h-8 text-xs font-medium whitespace-nowrap rounded-full px-3 ${config.className}`}>
      {config.label}
    </div>
  )
}