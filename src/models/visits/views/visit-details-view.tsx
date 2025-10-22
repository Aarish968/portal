import React from 'react'
import { ArrowLeft, MapPin, Clock, Play, X, Pencil } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ProcedureIncompleteDialog } from '../components/ProcedureIncompleteDialog'

const procedures = [
  { id: 'a1c', title: 'A1C' },
  { id: 'blood-pressure', title: 'Blood Pressure' },
  { id: 'urine-sample', title: 'Urine Sample' },
]

const reasonLabels: Record<string, string> = {
  'connectivity': 'Connectivity',
  'technical-issues': 'Technical Issues',
  'supplies-unavailable': 'Supplies/equipment unavailable',
  'patient-refused': 'Patient Refused',
  'kit-left-behind': 'Kit Left Behind',
  'not-medically-indicated': 'Not Medically Indicated',
  'test-deferred': 'Test Deferred',
  'incomplete-consent': 'Incomplete Consent',
  'safety-concerns': 'Safety Concerns'
}

type OutcomeValue = 'completed' | 'not-completed'
type VisitStatus = 'not-started' | 'in-progress' | 'ready-to-save' | 'completed'

export default function VisitDetailsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const [outcomes, setOutcomes] = React.useState<Record<string, OutcomeValue>>({})
  const [procedureReasons, setProcedureReasons] = React.useState<Record<string, string>>({})
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedProcedure, setSelectedProcedure] = React.useState<{id: string, title: string} | null>(null)
  const [visitStatus, setVisitStatus] = React.useState<VisitStatus>('not-started')
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [editingProcedure, setEditingProcedure] = React.useState<{id: string, title: string} | null>(null)
  const [isReopening, setIsReopening] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [cardEditingId, setCardEditingId] = React.useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)

  // Extract visit either from navigation state or fallback to param id
  const visitFromState = (location.state as any)?.visit
  const visitId = visitFromState?.id || params.visitId || '1'
  const patientName = visitFromState?.patientName || 'Jane Smith'
  const address = visitFromState?.address || '1234 Main Street, Dayton, OH'
  const time = visitFromState?.time || '10:30AM'
  const insurance = visitFromState?.insurance || 'UHC'
  const visitType = visitFromState?.visitType || 'in-home'

  
  // Load saved data from session storage and set initial visit status
  React.useEffect(() => {
    // Load saved visit data from session storage
    try {
      const stored = sessionStorage.getItem(`visit-state-${visitId}`)
      if (stored) {
        const savedData = JSON.parse(stored)
        if (savedData.outcomes) {
          setOutcomes(savedData.outcomes)
        }
        if (savedData.procedureReasons) {
          setProcedureReasons(savedData.procedureReasons)
        }
        if (savedData.status) {
          setVisitStatus(savedData.status)
        }
        setIsInitialLoad(false)
        return
      }
    } catch {}
    
    // Set initial visit status from navigation state if no saved data
    if (visitFromState?.status && !sessionStorage.getItem(`visit-state-${visitId}`)) {
      setVisitStatus(visitFromState.status)
      
      // Save initial state to session storage
      const initialVisitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitFromState.status,
        outcomes: {},
        procedureReasons: {}
      }
      try {
        sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(initialVisitData))
      } catch {}
    } else if (!sessionStorage.getItem(`visit-state-${visitId}`)) {
      // Default to not-started if no saved data and no navigation state
      // Don't save to session storage to avoid overriding dashboard display
      setVisitStatus('not-started')
    }
    
    setIsInitialLoad(false)
  }, [visitId, visitFromState?.status, patientName, address, time, insurance])

  const handleOutcomeClick = (procedureId: string, outcome: OutcomeValue) => {
    if (outcome === 'not-completed') {
      const procedure = procedures.find(p => p.id === procedureId)
      if (procedure) {
        setSelectedProcedure(procedure)
        setDialogOpen(true)
      }
    } else {
      const newOutcomes = {
        ...outcomes,
        [procedureId]: outcome
      }
      setOutcomes(newOutcomes)
      
      // Save to session storage immediately
      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitStatus === 'not-started' ? 'in-progress' : visitStatus,
        outcomes: newOutcomes,
        procedureReasons
      }
      try {
        sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(visitData))
      } catch {}
      
      // When any outcome is set, change status to in-progress
      if (visitStatus === 'not-started') {
        setVisitStatus('in-progress')
      }
    }
  }

  const handleDialogSave = (reason: string, description?: string) => {
    if (selectedProcedure) {
      console.log(`Procedure ${selectedProcedure.title} not completed:`, { reason, description })
      const newOutcomes = {
        ...outcomes,
        [selectedProcedure.id]: 'not-completed' as OutcomeValue
      }
      const newReasons = {
        ...procedureReasons,
        [selectedProcedure.id]: reason
      }
      
      setOutcomes(newOutcomes)
      setProcedureReasons(newReasons)
      
      // Save to session storage immediately
      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitStatus === 'not-started' ? 'in-progress' : visitStatus,
        outcomes: newOutcomes,
        procedureReasons: newReasons
      }
      try {
        sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(visitData))
      } catch {}
      
      // Change status to in-progress if not started
      if (visitStatus === 'not-started') {
        setVisitStatus('in-progress')
      }
    }
  }

  const handleEditClick = (procedureId: string) => {
    // Toggle card editing mode
    if (cardEditingId === procedureId) {
      setCardEditingId(null) // Close editing if already editing this card
    } else {
      setCardEditingId(procedureId) // Start editing this card
    }
  }

  const handleEditDialogSave = (outcome: OutcomeValue, reason?: string) => {
    if (editingProcedure) {
      const newOutcomes = {
        ...outcomes,
        [editingProcedure.id]: outcome
      }
      const newReasons = reason ? {
        ...procedureReasons,
        [editingProcedure.id]: reason
      } : procedureReasons
      
      setOutcomes(newOutcomes)
      if (reason) setProcedureReasons(newReasons)
      
      // Update session storage
      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitStatus,
        outcomes: newOutcomes,
        procedureReasons: newReasons
      }
      try {
        sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(visitData))
      } catch {}
    }
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    setEditingProcedure(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedProcedure(null)
  }

  const completedCount = Object.values(outcomes).filter(o => o === 'completed').length
  // Count all outcomes (completed + not-completed) for progress bar
  const totalOutcomesSet = Object.values(outcomes).filter(o => o === 'completed' || o === 'not-completed').length
  // Total outcomes include procedures plus HRA start action
  const totalOutcomes = procedures.length + 1
  const progressPercent = Math.min(100, Math.round((totalOutcomesSet / totalOutcomes) * 100))

  // Check if all procedures and HRA have outcomes (completed or not-completed)
  const allProceduresHaveOutcomes = procedures.every(proc => outcomes[proc.id])
  const hraHasOutcome = outcomes['hra']
  const allOutcomesSet = allProceduresHaveOutcomes && hraHasOutcome

  // Update visit status based on completion - only set to ready-to-save, not completed
  // Don't auto-change status if user explicitly clicked edit
  const [isExplicitlyEditing, setIsExplicitlyEditing] = React.useState(false)
  
  React.useEffect(() => {
    if (isInitialLoad) return // Don't auto-change status during initial load
    
    // If all outcomes are set, always change to ready-to-save (regardless of editing mode)
    if (allOutcomesSet && (visitStatus === 'not-started' || visitStatus === 'in-progress')) {
      setVisitStatus('ready-to-save')
    }
  }, [allOutcomesSet, visitStatus, isInitialLoad])

  // Save to session storage whenever visitStatus changes (but not during initial load)
  React.useEffect(() => {
    if (isInitialLoad) return
    
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
    try {
      sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(visitData))
    } catch {}
  }, [visitStatus, outcomes, procedureReasons, visitId, patientName, address, time, insurance, isInitialLoad])

  const handleSaveVisit = () => {
    console.log('Saving visit...', { outcomes, procedureReasons })
    setIsSaving(true)
    
    // Show "Saving" for a brief moment, then complete
    setTimeout(() => {
      setIsSaving(false)
      setVisitStatus('completed')
      setIsExplicitlyEditing(false)
      
      // After saving, stay on visit details page with completed status
      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: 'completed' as const,
        outcomes,
        procedureReasons
      }
      // Persist for other pages (e.g., Visits dashboard)
      try {
        sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(visitData))
      } catch {}
    }, 1000) // Show "Saving" for 1 second
  }

  const handleEditVisit = () => {
    setIsReopening(true)
    
    // Show "Reopening" for a brief moment, then switch to edit mode
    setTimeout(() => {
      setIsReopening(false)
      setVisitStatus('in-progress')
      setIsExplicitlyEditing(true)
      
      // Update session storage immediately when editing
      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: 'in-progress' as const,
        outcomes,
        procedureReasons
      }
      try {
        sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(visitData))
      } catch {}
    }, 1000) // Show "Reopening" for 1 second
  }

  // Check if visit needs to be saved after editing
  const needsSaving = React.useMemo(() => {
    // Show save button when all outcomes are set (regardless of completed/not-completed)
    if ((visitStatus === 'in-progress' || visitStatus === 'ready-to-save') && allOutcomesSet) {
      return true
    }
    return false
  }, [visitStatus, allOutcomesSet])






  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - Full Width */}
      <div className="w-full flex-shrink-0">
        <div className="flex items-center justify-between bg-white border border-gray-300 px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => {
              // Check if we came from visit outcomes, if so go back there
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
            }} style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              appearance: 'none',
              textAlign: 'center',
              fontSize: '1.5rem',
              color: 'rgb(147, 144, 144)',
              backgroundColor: 'rgb(245, 245, 245)',
              width: '44px',
              height: '44px',
              outline: '0px',
              border: '0px',
              margin: '0px',
              textDecoration: 'none',
              flex: '0 0 auto',
              padding: '8px',
              borderRadius: '50%',
              transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Visit Details</h1>
              <p className="text-sm text-gray-500">{patientName} - {address}</p>
            </div>
          </div>
          
          {/* Dynamic Header Buttons */}
          <div className="flex items-center gap-3">
            {/* Reopening State - with Completed button */}
            {isReopening && (
              <>
                <div className="inline-flex items-center justify-center h-8 text-xs font-medium text-white whitespace-nowrap rounded-full px-3" style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  backgroundColor: 'rgb(25, 154, 146)',
                  lineHeight: '1.5',
                  cursor: 'unset',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  Completed
                </div>
                <div className="inline-flex items-center justify-center h-8 text-xs font-medium whitespace-nowrap rounded-full px-3" style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  backgroundColor: 'white',
                  color: 'rgb(107, 114, 128)',
                  lineHeight: '1.5',
                  border: '1px solid rgb(229, 231, 235)',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  Reopening...
                </div>
              </>
            )}
            
            {/* Saving State - with Ready to Save button */}
            {isSaving && (
              <>
                <div className="inline-flex items-center justify-center h-8 text-xs font-medium text-gray-900 whitespace-nowrap rounded-full px-3" style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  backgroundColor: 'rgba(35, 155, 207, 0.08)',
                  lineHeight: '1.5',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  Ready to Save
                </div>
                <div className="inline-flex items-center justify-center h-8 text-xs font-medium whitespace-nowrap rounded-full px-3" style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  backgroundColor: 'white',
                  color: 'rgb(107, 114, 128)',
                  lineHeight: '1.5',
                  border: '1px solid rgb(229, 231, 235)',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  Saving...
                </div>
              </>
            )}
            
            {/* In Progress Mode - Show when at least one procedure or HRA is done but not all */}
            {!isReopening && !isSaving && visitStatus === 'in-progress' && !allOutcomesSet && (completedCount > 0 || outcomes['hra']) && (
              <div 
                className="inline-flex items-center justify-center px-6"
                style={{
                  maxWidth: '100%',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  height: '32px',
                  lineHeight: '1.5',
                  cursor: 'unset',
                  verticalAlign: 'middle',
                  boxSizing: 'border-box',
                  fontSize: '0.75rem',
                  backgroundColor: 'rgb(228, 118, 0)',
                  color: 'rgb(255, 255, 255)',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: '0px',
                  textDecoration: 'none',
                  border: '0px',
                  padding: '0px',
                  borderRadius: '999px',
                  minWidth: '100px'
                }}
              >
                In Progress
              </div>
            )}
            
            {/* Save Mode - Show appropriate buttons based on state */}
            {!isReopening && !isSaving && (visitStatus === 'ready-to-save' || needsSaving) && (
              <>
                {/* Show Ready to Save button only when ready to save */}
                <div className="inline-flex items-center justify-center h-8 text-xs font-medium text-gray-900 whitespace-nowrap rounded-full px-3" style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  backgroundColor: 'rgba(35, 155, 207, 0.08)',
                  lineHeight: '1.5',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  Ready to Save
                </div>
                
                <button
                  onClick={handleSaveVisit}
                  className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none text-sm leading-7 min-w-16 text-white font-semibold px-6 py-2 min-h-10 outline-0 m-0 no-underline border-0 transition-all duration-250 ease-out"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    backgroundColor: 'rgb(85, 56, 166)',
                    borderRadius: '18px',
                    textTransform: 'none',
                    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Save
                </button>
              </>
            )}
            
            {!isReopening && !isSaving && visitStatus === 'completed' && (
              <>
                <div className="inline-flex items-center justify-center h-8 text-xs font-medium text-white whitespace-nowrap rounded-full px-3" style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  backgroundColor: 'rgb(25, 154, 146)',
                  lineHeight: '1.5',
                  cursor: 'unset',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                  Completed
                </div>
                <button
                  onClick={handleEditVisit}
                  className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none text-sm leading-7 min-w-16 font-semibold px-6 py-2 min-h-10 outline-0 m-0 no-underline border border-solid transition-all duration-250 ease-out ml-4"
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    backgroundColor: 'transparent',
                    color: 'rgb(85, 56, 166)',
                    borderColor: 'rgb(85, 56, 166)',
                    borderRadius: '18px',
                    textTransform: 'none',
                    transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <Pencil className="w-4 h-4 inline mr-2" style={{ color: 'rgb(85, 56, 166)' }} />
                  Edit
                </button>
              </>
            )}
            
            {(visitStatus === 'not-started' || (visitStatus === 'in-progress' && completedCount === 0 && !outcomes['hra'])) && (
              <div 
                className="inline-flex items-center justify-center px-6"
                style={{
                  maxWidth: '100%',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  height: '32px',
                  lineHeight: '1.5',
                  color: 'rgb(27, 27, 27)',
                  backgroundColor: 'rgba(35, 155, 207, 0.08)',
                  cursor: 'unset',
                  verticalAlign: 'middle',
                  boxSizing: 'border-box',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: '0px',
                  textDecoration: 'none',
                  border: '0px',
                  padding: '0px',
                  borderRadius: '999px',
                  minWidth: '110px'
                }}
              >
                Not Started
              </div>
            )}
            

          </div>
        </div>
      </div>

      {/* Content Container - Centered with max width */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Info */}
            <div>
              <h2 className="text-lg font-semibold mb-4" style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#1B1B1B'
              }}>{patientName}</h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  color: '#939090'
                }}>ID: {visitId}</p>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: '#1B1B1B'
                  }}>{address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: '#1B1B1B'
                  }}>{time}</span>
                </div>
              </div>
            </div>

            {/* Visit Progress */}
            <div>
              <h3 className="text-base font-semibold mb-2" style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#1B1B1B'
              }}>Visit Progress</h3>
              <p className="text-sm mb-2" style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#939090'
              }}>Outcomes Captured</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${progressPercent}%`, backgroundColor: 'rgb(85, 56, 166)' }}
                    />
                  </div>
                </div>
                <span className="text-base font-semibold" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  color: '#1B1B1B'
                }}>{totalOutcomesSet}/{totalOutcomes}</span>
              </div>
              
              <div className="mt-6">
                <h4 className="text-base font-semibold mb-3" style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  color: '#1B1B1B'
                }}>Equipment Needed</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs" style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: '#1B1B1B'
                  }}>
                    A1C Kit
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs" style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: '#1B1B1B'
                  }}>
                    Blood Pressure Monitor
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs" style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    color: '#1B1B1B'
                  }}>
                    Urine Collection Kit
                  </span>
                </div>
              </div>
            </div>

            {/* HRA Assessment */}
            <div>
              <h3 className="text-base font-semibold mb-1" style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#1B1B1B'
              }}>HRA Assessment</h3>
              <p className="text-sm mb-4" style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                color: '#939090'
              }}>Health Risk Assessment questionnaire</p>
              {outcomes['hra'] === 'completed' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 font-medium" style={{ color: 'rgb(25, 154, 146)' }}>
                    <div 
                      className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgb(25, 154, 146)' }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 16 16" 
                        fill="none"
                        className="w-3 h-3"
                      >
                        <path d="M6.5 11.3L3.5 8.3L4.55 7.25L6.5 9.2L11.45 4.25L12.5 5.3L6.5 11.3Z" fill="white"/>
                      </svg>
                    </div>
                    <span>Assessment Complete</span>
                  </div>
                  
                  {/* Start Telehealth button for telehealth visits */}
                  {visitType === 'telehealth' && (
                    <button
                      onClick={() => {
                        // Handle telehealth start logic here
                        console.log('Starting telehealth session...')
                      }}
                      className="w-full flex items-center justify-center gap-2 font-semibold transition-all duration-250 ease-out"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        fontSize: '0.875rem',
                        lineHeight: '1.75',
                        minWidth: '64px',
                        minHeight: '44px',
                        backgroundColor: 'transparent',
                        color: 'rgb(35, 155, 207)',
                        textTransform: 'none',
                        fontWeight: '600',
                        outline: '0px',
                        margin: '0px',
                        textDecoration: 'none',
                        padding: '12px 15px',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: 'rgb(35, 155, 207)',
                        borderRadius: '18px',
                        transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                        <path d="M4.5 20C3.95 20 3.475 19.8083 3.075 19.425C2.69167 19.025 2.5 18.55 2.5 18V6C2.5 5.45 2.69167 4.98333 3.075 4.6C3.475 4.2 3.95 4 4.5 4H16.5C17.05 4 17.5167 4.2 17.9 4.6C18.3 4.98333 18.5 5.45 18.5 6V10.5L22.5 6.5V17.5L18.5 13.5V18C18.5 18.55 18.3 19.025 17.9 19.425C17.5167 19.8083 17.05 20 16.5 20H4.5ZM4.5 18H16.5V6H4.5V18ZM4.5 18V6V18Z" fill="#239BCF"/>
                      </svg>
                      <span>Start Telehealth</span>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleOutcomeClick('hra', 'completed')}
                  className="w-full bg-[#5538A6] hover:bg-[#4A2F95] text-white font-medium py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.99]"
                  aria-pressed={false}
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Start HRA</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Procedures */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Visit Procedures</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {procedures.map((procedure) => {
              const outcome = outcomes[procedure.id]
              const reason = procedureReasons[procedure.id]
              
              return (
                <div key={procedure.id} className={`bg-white rounded-2xl shadow-sm p-6 transition-shadow duration-300 hover:shadow-md ${cardEditingId === procedure.id ? 'flex flex-col' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">{procedure.title}</h3>
                    <div className="flex items-center gap-2">
                      {/* Status Badge - show when outcome exists */}
                      {outcome && cardEditingId !== procedure.id && (
                        <div 
                          className="inline-flex items-center justify-center gap-2 px-4"
                          style={{
                            maxWidth: '100%',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            lineHeight: '1.5',
                            cursor: 'unset',
                            verticalAlign: 'middle',
                            boxSizing: 'border-box',
                            height: '24px',
                            fontSize: '0.75rem',
                            backgroundColor: outcome === 'completed' ? 'rgb(25, 154, 146)' : 'rgb(207, 35, 35)',
                            color: 'rgb(255, 255, 255)',
                            fontWeight: '500',
                            whiteSpace: 'nowrap',
                            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            outline: '0px',
                            textDecoration: 'none',
                            padding: '0px',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: outcome === 'completed' ? 'rgba(25, 154, 146, 0.7)' : 'rgba(207, 35, 35, 0.7)',
                            borderRadius: '24px',
                            minWidth: '120px'
                          }}
                        >
                          {outcome === 'completed' ? (
                            <>
                              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                  <path d="M6.5 11.3L3.5 8.3L4.55 7.25L6.5 9.2L11.45 4.25L12.5 5.3L6.5 11.3Z" fill="#15827B"/>
                                </svg>
                              </div>
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                  <path d="M5.12 12L8 9.12L10.88 12L12 10.88L9.12 8L12 5.12L10.88 4L8 6.88L5.12 4L4 5.12L6.88 8L4 10.88L5.12 12Z" fill="#CF2323"/>
                                </svg>
                              </div>
                              <span>Not Completed</span>
                            </>
                          )}
                        </div>
                      )}
                      
                      {/* Editing Badge - show when this card is being edited */}
                      {cardEditingId === procedure.id && (
                        <div 
                          className="inline-flex items-center justify-center text-xs font-medium whitespace-nowrap px-4"
                          style={{
                            maxWidth: '100%',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            lineHeight: '1.5',
                            cursor: 'unset',
                            verticalAlign: 'middle',
                            boxSizing: 'border-box',
                            height: '24px',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            backgroundColor: 'rgb(255, 244, 230)',
                            color: 'rgb(228, 118, 0)',
                            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                            outline: '0px',
                            textDecoration: 'none',
                            padding: '0px',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderRadius: '24px',
                            borderColor: 'rgb(228, 118, 0)',
                            minWidth: '80px'
                          }}
                        >
                          Editing
                        </div>
                      )}
                      {/* Edit/Close Button - show when Save button is visible at top and procedure has outcome */}
                      {(visitStatus === 'in-progress' || visitStatus === 'ready-to-save' || needsSaving) && outcome && (
                        <button
                          onClick={() => handleEditClick(procedure.id)}
                          className={`p-1.5 transition-colors ${
                            cardEditingId === procedure.id 
                              ? '' 
                              : 'hover:bg-gray-100 rounded-2xl'
                          }`}
                          title={cardEditingId === procedure.id ? "Close editing" : "Edit status"}
                        >
                          {cardEditingId === procedure.id ? (
                            <X className="w-4 h-4 text-gray-500 hover:text-red-700 transition-colors" />
                          ) : (
                            <Pencil className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Edit Mode Message - only show when this specific card is being edited */}
                  {cardEditingId === procedure.id && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 20 20" 
                        fill="none"
                        className="flex-shrink-0"
                      >
                        <path d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14C11 13.7167 10.9042 13.4792 10.7125 13.2875C10.5208 13.0958 10.2833 13 10 13C9.71667 13 9.47917 13.0958 9.2875 13.2875C9.09583 13.4792 9 13.7167 9 14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM9 11H11V5H9V11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#239BCF"/>
                      </svg>
                      <span className="text-sm text-gray-600">Editing mode - Select outcome and save changes</span>
                    </div>
                  )}
                  
                  {/* Show reason for not completed procedures */}
                  {outcome === 'not-completed' && reason && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Reason:</p>
                      <p className="text-sm text-gray-700">{reasonLabels[reason] || reason}</p>
                    </div>
                  )}
                  
                  {/* Action buttons - show when this card is being edited or when no outcome set */}
                  {(cardEditingId === procedure.id || !outcome) && (
                    <div>
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Outcome:</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              handleOutcomeClick(procedure.id, 'completed')
                              if (cardEditingId === procedure.id) {
                                setCardEditingId(null) // Close editing after selection
                              }
                            }}
                            className="flex-1"
                            style={{
                              position: 'relative',
                              appearance: 'none',
                              maxWidth: '100%',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '32px',
                              lineHeight: '1.5',
                              verticalAlign: 'middle',
                              boxSizing: 'border-box',
                              userSelect: 'none',
                              fontWeight: '500',
                              fontSize: '0.75rem',
                              backgroundColor: outcome === 'completed' ? 'rgb(25, 154, 146)' : 'white',
                              color: outcome === 'completed' ? 'rgb(255, 255, 255)' : 'rgb(107, 114, 128)',
                              cursor: 'pointer',
                              margin: '0px',
                              whiteSpace: 'nowrap',
                              transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                              outline: '0px',
                              textDecoration: 'none',
                              border: outcome === 'completed' ? '0px' : '1px solid rgb(209, 213, 219)',
                              padding: '0px',
                              borderRadius: '999px'
                            }}
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => {
                              handleOutcomeClick(procedure.id, 'not-completed')
                              if (cardEditingId === procedure.id) {
                                setCardEditingId(null) // Close editing after selection
                              }
                            }}
                            className="flex-1"
                            style={{
                              position: 'relative',
                              appearance: 'none',
                              maxWidth: '100%',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '32px',
                              lineHeight: '1.5',
                              verticalAlign: 'middle',
                              boxSizing: 'border-box',
                              userSelect: 'none',
                              fontWeight: '500',
                              fontSize: '0.75rem',
                              backgroundColor: outcome === 'not-completed' ? 'rgb(207, 35, 35)' : 'white',
                              color: outcome === 'not-completed' ? 'rgb(255, 255, 255)' : 'rgb(107, 114, 128)',
                              cursor: 'pointer',
                              margin: '0px',
                              whiteSpace: 'nowrap',
                              transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                              outline: '0px',
                              textDecoration: 'none',
                              border: outcome === 'not-completed' ? '0px' : '1px solid rgb(209, 213, 219)',
                              padding: '0px',
                              borderRadius: '999px'
                            }}
                          >
                            Not Completed
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        </div>
      </div>

      {/* Procedure Incomplete Dialog */}
      {selectedProcedure && (
        <ProcedureIncompleteDialog
          isOpen={dialogOpen}
          onClose={handleDialogClose}
          procedureName={selectedProcedure.title}
          onSave={handleDialogSave}
        />
      )}

      {/* Edit Dialog */}
      {editingProcedure && (
        <EditProcedureDialog
          isOpen={editDialogOpen}
          onClose={handleEditDialogClose}
          procedureName={editingProcedure.title}
          currentOutcome={outcomes[editingProcedure.id]}
          onSave={handleEditDialogSave}
        />
      )}
    </div>
  )
}

// Edit Procedure Dialog Component
function EditProcedureDialog({ 
  isOpen, 
  onClose, 
  procedureName, 
  currentOutcome,
  onSave 
}: {
  isOpen: boolean
  onClose: () => void
  procedureName: string
  currentOutcome?: OutcomeValue
  onSave: (outcome: OutcomeValue, reason?: string) => void
}) {
  const [selectedOutcome, setSelectedOutcome] = React.useState<OutcomeValue | null>(currentOutcome || null)
  const [reason, setReason] = React.useState('')

  const handleSave = () => {
    if (selectedOutcome) {
      onSave(selectedOutcome, selectedOutcome === 'not-completed' ? reason : undefined)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{procedureName}</h3>
        <p className="text-sm text-gray-600 mb-1">Editing</p>
        <p className="text-xs text-gray-500 mb-4">Editing mode - Select outcome and save changes</p>
        
        <div className="space-y-3 mb-4">
          <button
            onClick={() => setSelectedOutcome('completed')}
            className={`w-full p-3 rounded-2xl border text-left ${
              selectedOutcome === 'completed' 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Completed
          </button>
          
          <button
            onClick={() => setSelectedOutcome('not-completed')}
            className={`w-full p-3 rounded-2xl border text-left ${
              selectedOutcome === 'not-completed' 
                ? 'border-red-500 bg-red-50 text-red-700' 
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Not Completed
          </button>
        </div>

        {selectedOutcome === 'not-completed' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <select 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select reason...</option>
              <option value="patient-refused">Patient Refused</option>
              <option value="supplies-unavailable">Supplies/equipment unavailable</option>
              <option value="technical-issues">Technical Issues</option>
              <option value="not-medically-indicated">Not Medically Indicated</option>
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedOutcome || (selectedOutcome === 'not-completed' && !reason)}
            className="flex-1 px-4 py-2 bg-[#5538A6] text-white rounded-lg hover:bg-[#4A2F95] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}























// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Clock, MapPin, Building, Folder } from 'lucide-react'
// import { VisitDetailsHeader } from '../components/visit-details-header'
// import { OutcomeCard } from '../components/outcome-card'
// import { VisitProgress } from '../components/visit-progress'

// const assessments = [
//   { id: 'a1c', title: 'A1C' },
//   { id: 'blood-pressure', title: 'Blood Pressure Check' },
//   { id: 'medication', title: 'Medication Review' },
//   { id: 'wound', title: 'Wound Assessment' },
//   { id: 'nutrition', title: 'Nutritional Counseling' },
//   { id: 'mobility', title: 'Physical Mobility Assessment' },
// ]

// export function VisitDetailsView() {
//   const navigate = useNavigate()

//   const handleOutcomeClick = (assessmentId: string, outcome: 'completed' | 'not-completed') => {
//     console.log(`${assessmentId}: ${outcome}`)
//   }

//   const handleBackClick = () => {
//     navigate('/visits')
//   }

//   const handleStartHRA = () => {
//     console.log('Start HRA Assessment')
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-5">
//       <div className="max-w-6xl mx-auto space-y-5">
//         {/* Header */}
//         <VisitDetailsHeader 
//           address="1234 Main Street, Dayton, OH"
//           status="not-started"
//           onBackClick={handleBackClick}
//         />

//         {/* Main Content Card */}
//         <div className="bg-white rounded-2xl shadow-md p-6">
//           <div className="flex justify-between items-start">
//             {/* Patient Info */}
//             <div className="flex flex-col gap-4">
//               <h2 className="text-gray-900 font-medium text-base">
//                 Jane Smith
//               </h2>
              
//               <div className="flex flex-col gap-2">
//                 <div className="flex items-center gap-1">
//                   <Clock className="w-4 h-4 text-gray-400" />
//                   <span className="text-gray-400 text-sm">10:30AM</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <MapPin className="w-4 h-4 text-gray-400" />
//                   <span className="text-gray-400 text-sm">1234 Main Street, Dayton, OH</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Building className="w-4 h-4 text-gray-400" />
//                   <span className="text-gray-400 text-sm">UHC</span>
//                 </div>
//               </div>
              
//               <div className="px-2 py-1 rounded-full border border-purple-600 bg-white w-fit">
//                 <span className="text-purple-600 text-xs font-medium">In-Home Visit</span>
//               </div>
//             </div>

//             {/* Visit Progress and Equipment */}
//             <div className="flex gap-20">
//               <div className="flex flex-col gap-4">
//                 <VisitProgress completed={0} total={8} />
                
//                 {/* Equipment Section */}
//                 <div className="flex flex-col gap-4">
//                   <h4 className="text-gray-900 font-medium text-base">Equipment Needed</h4>
//                   <div className="flex gap-2">
//                     <div className="px-2 py-1 rounded-full border border-gray-400 bg-white">
//                       <span className="text-gray-900 text-xs font-medium">Stethoscope</span>
//                     </div>
//                     <div className="px-2 py-1 rounded-full border border-gray-400 bg-white">
//                       <span className="text-gray-900 text-xs font-medium">Thermometer</span>
//                     </div>
//                     <div className="px-2 py-1 rounded-full border border-gray-400 bg-white">
//                       <span className="text-gray-900 text-xs font-medium">Blood Pressure Monitor</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* HRA Assessment */}
//               <div className="flex flex-col gap-4 w-80">
//                 <div>
//                   <h3 className="text-black font-medium text-base">HRA Assessment</h3>
//                   <span className="text-gray-400 font-medium text-sm">Health Risk Assessment Questionaire</span>
//                 </div>
                
//                 <button 
//                   onClick={handleStartHRA}
//                   className="flex w-72 h-14 justify-center items-center rounded-xl bg-purple-600 shadow-md hover:bg-purple-700 transition-colors"
//                 >
//                   <div className="flex p-4 justify-center items-center gap-2">
//                     <span className="text-white font-medium text-base">Start HRA Assessment</span>
//                     <Folder className="w-6 h-6 text-white" />
//                   </div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Outcome Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {assessments.map((assessment) => (
//             <OutcomeCard 
//               key={assessment.id}
//               title={assessment.title}
//               onCompletedClick={() => handleOutcomeClick(assessment.id, 'completed')}
//               onNotCompletedClick={() => handleOutcomeClick(assessment.id, 'not-completed')}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

export { VisitDetailsView }