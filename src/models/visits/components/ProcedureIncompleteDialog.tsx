import React, { useState } from 'react'
import { X } from 'lucide-react'

interface ProcedureIncompleteDialogProps {
  isOpen: boolean
  onClose: () => void
  procedureName: string
  onSave: (reason: string, description?: string) => void
}

const incompleteReasons = [
  {
    id: 'connectivity',
    label: 'Connectivity',
    description: 'Internet or network connectivity issues preventing test completion'
  },
  {
    id: 'technical-issues',
    label: 'Technical Issues',
    description: 'Equipment malfunction or connectivity problems',
    hasTextField: true
  },
  {
    id: 'supplies-unavailable',
    label: 'Supplies/equipment unavailable',
    description: 'Required supplies are not available to complete test'
  },
  {
    id: 'patient-refused',
    label: 'Patient Refused',
    description: 'Patient declined the test due to personal preference, discomfort, misunderstanding, or wants PCP to perform'
  },
  {
    id: 'kit-left-behind',
    label: 'Kit Left Behind',
    description: 'Testing kit was left with patient to complete later.'
  },
  {
    id: 'not-medically-indicated',
    label: 'Not Medically Indicated',
    description: 'Based on clinical judgment, the test was unnecessary at the time of visit'
  },
  {
    id: 'test-deferred',
    label: 'Test Deferred',
    description: 'Provider chose to postpone due to Patient completion elsewhere within previous 30 days'
  },
  {
    id: 'incomplete-consent',
    label: 'Incomplete Consent',
    description: 'Patient withdrew consent mid-procedure'
  },
  {
    id: 'safety-concerns',
    label: 'Safety Concerns',
    description: 'Unsafe conditions in the home that prevent proper testing'
  }
]

export function ProcedureIncompleteDialog({
  isOpen,
  onClose,
  procedureName,
  onSave
}: ProcedureIncompleteDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const handleSave = () => {
    if (selectedReason) {
      onSave(selectedReason, description)
      setSelectedReason('')
      setDescription('')
      onClose()
    }
  }

  const handleCancel = () => {
    setSelectedReason('')
    setDescription('')
    onClose()
  }

  const selectedReasonData = incompleteReasons.find(reason => reason.id === selectedReason)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Select reason for not completing '{procedureName}'
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {incompleteReasons.map((reason) => (
              <div key={reason.id} className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="incomplete-reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 w-4 h-4 text-[#5538A6] border-gray-300 focus:ring-[#5538A6]"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{reason.label}</div>
                    <div className="text-sm text-gray-500 mt-1">{reason.description}</div>
                  </div>
                </label>

                {/* Text input for technical issues */}
                {reason.hasTextField && selectedReason === reason.id && (
                  <div className="ml-7 mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please describe the technical issue (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the technical issue..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5538A6] focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedReason}
            className="px-6 py-2 bg-[#5538A6] hover:bg-[#4A2F95] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}