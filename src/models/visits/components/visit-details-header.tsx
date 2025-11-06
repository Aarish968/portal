import { ArrowLeft } from 'lucide-react'
import { VisitStatus } from '../types'

interface VisitDetailsHeaderProps {
  patientName: string
  address: string
  status: VisitStatus
  onBackClick: () => void
}

const STATUS_CONFIG = {
  'not-started': {
    label: 'Not Started',
    className: 'bg-gray-100 text-gray-700 border-gray-300'
  },
  'in-progress': {
    label: 'In Progress', 
    className: 'bg-orange-100 text-orange-700 border-orange-300'
  },
  'ready-to-save': {
    label: 'Ready to Save',
    className: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  'completed': {
    label: 'Completed',
    className: 'bg-green-100 text-green-700 border-green-300'
  }
} as const

export function VisitDetailsHeader({ 
  patientName,
  address, 
  status,
  onBackClick 
}: VisitDetailsHeaderProps) {
  const statusConfig = STATUS_CONFIG[status]

  return (
    <div className="w-full flex-shrink-0">
      <div className="flex items-center justify-between bg-white border border-gray-300 px-6 py-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackClick}
            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Visit Details</h1>
            <p className="text-sm text-gray-500">{patientName} - {address}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1.5 rounded-full border text-xs font-medium ${statusConfig.className}`}>
          {statusConfig.label}
        </div>
      </div>
    </div>
  )
}
