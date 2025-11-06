import React from 'react'
import { Play } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

// Import our new structured components and hooks
import {
  VisitDetailsHeader,
  OutcomeCard,
  ProcedureIncompleteDialog,
  VisitStatusBadge,
  VisitActionButtons,
  PatientInfoCard
} from '../components'

import { useVisitState } from '../hooks/useVisitState'
import { PROCEDURES, TOTAL_OUTCOMES } from '../constants'
import { OutcomeValue, VisitType } from '../types'

export default function VisitDetailsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  
  // State for dialogs and UI
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedProcedure, setSelectedProcedure] = React.useState<{id: string, title: string} | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isReopening, setIsReopening] = React.useState(false)

  // Extract visit data from navigation state or use defaults
  const visitFromState = (location.state as any)?.visit
  const visitId = visitFromState?.id || params.visitId || '1'
  const patientName = visitFromState?.patientName || 'Jane Smith'
  const address = visitFromState?.address || '1234 Main Street, Dayton, OH'
  const time = visitFromState?.time || '10:30AM'
  const insurance = visitFromState?.insurance || 'UHC'
  const visitType: VisitType = visitFromState?.visitType || 'in-home'

  // Use our custom hook for visit state management
  const {
    visitState,
    outcomes,
    procedureReasons,
    visitStatus,
    isInitialLoad,
    updateOutcome,
    updateVisitStatus,
    saveVisit,
    progressData
  } = useVisitState({
    visitId,
    initialVisit: {
      patientName,
      address,
      time,
      insurance,
      status: visitFromState?.status
    }
  })

  const handleOutcomeClick = (procedureId: string, outcome: OutcomeValue) => {
    if (outcome === 'not-completed') {
      const procedure = PROCEDURES.find(p => p.id === procedureId)
      if (procedure) {
        setSelectedProcedure(procedure)
        setDialogOpen(true)
      }
    } else {
      updateOutcome(procedureId, outcome)
    }
  }

  const handleDialogSave = (reason: string, description?: string) => {
    if (selectedProcedure) {
      console.log(`Procedure ${selectedProcedure.title} not completed:`, { reason, description })
      updateOutcome(selectedProcedure.id, 'not-completed', reason)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedProcedure(null)
  }

  const handleSaveVisit = async () => {
    setIsSaving(true)
    try {
      await saveVisit()
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditVisit = () => {
    setIsReopening(true)
    setTimeout(() => {
      setIsReopening(false)
      updateVisitStatus('in-progress')
    }, 1000)
  }

  const handleBackClick = () => {
    const fromOutcomes = location.state?.fromOutcomes
    if (fromOutcomes) {
      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitStatus,
        outcomes,
        procedureReasons
      }
      navigate('/visit-outcomes', { state: { visitData }, replace: true })
    } else {
      navigate('/visits', { replace: true })
    }
  }

  const handleHraOutcome = (outcome: OutcomeValue) => {
    updateOutcome('hra', outcome)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <VisitDetailsHeader
        patientName={patientName}
        address={address}
        status={visitStatus}
        onBackClick={handleBackClick}
      />

      {/* Status and Action Buttons */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-end gap-3">
          <VisitStatusBadge
            status={visitStatus}
            isLoading={isSaving || isReopening}
            loadingText={isSaving ? 'Saving...' : isReopening ? 'Reopening...' : undefined}
          />
          
          <VisitActionButtons
            status={visitStatus}
            needsSaving={progressData.needsSaving}
            isSaving={isSaving}
            isReopening={isReopening}
            onSave={handleSaveVisit}
            onEdit={handleEditVisit}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Patient Info Card */}
          <PatientInfoCard
            patientName={patientName}
            visitId={visitId}
            address={address}
            time={time}
            progressData={progressData}
            totalOutcomes={TOTAL_OUTCOMES}
          />

          {/* HRA Assessment Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h3 className="text-base font-semibold mb-1 text-gray-900">HRA Assessment</h3>
                <p className="text-sm mb-4 text-gray-500">Health Risk Assessment questionnaire</p>
                
                {outcomes['hra'] === 'completed' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-medium text-teal-600">
                      <div className="w-4 h-4 rounded-sm bg-teal-600 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-3 h-3">
                          <path d="M6.5 11.3L3.5 8.3L4.55 7.25L6.5 9.2L11.45 4.25L12.5 5.3L6.5 11.3Z" fill="white"/>
                        </svg>
                      </div>
                      <span>Assessment Complete</span>
                    </div>
                    
                    {visitType === 'telehealth' && (
                      <button
                        onClick={() => console.log('Starting telehealth session...')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Start Telehealth
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={() => handleHraOutcome('completed')}
                      className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Start HRA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Procedures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCEDURES.map((procedure) => (
              <OutcomeCard
                key={procedure.id}
                title={procedure.title}
                outcome={outcomes[procedure.id]}
                onCompletedClick={() => handleOutcomeClick(procedure.id, 'completed')}
                onNotCompletedClick={() => handleOutcomeClick(procedure.id, 'not-completed')}
                disabled={visitStatus === 'completed'}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Procedure Incomplete Dialog */}
      <ProcedureIncompleteDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        procedureTitle={selectedProcedure?.title || ''}
      />
    </div>
  )
}