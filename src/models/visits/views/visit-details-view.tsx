import React from 'react'
import { ArrowLeft, MapPin, Clock, X, Pencil, Loader2, Folder } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ProcedureIncompleteDialog } from '../components/ProcedureIncompleteDialog'
import { useToast } from '@/base_submod/hooks/use-toast'
import { useMemberStore } from '@/models/member/stores/member-store'
import { useForceSaveError, ForceSaveErrorToggle } from '../components/force-save-error-toggle'
import { useVisitsApi } from '../hooks/useVisitsApi'
import type { UpdateLabPayload, UpdateGapPayload, LabNotCompletedReason } from '../types'

// This will be dynamically generated from API data

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

const reasonToApiReason: Record<string, LabNotCompletedReason> = {
  'kit-left-behind': 'Kit Left Behind',
  'incomplete-consent': 'Incomplete Consent',
  'not-medically-indicated': 'Not Medically Indicated',
  'patient-refused': 'Patient Refused',
  'safety-concerns': 'Safety Concerns',
  'technical-issues': 'Technical Issues',
  'test-deferred': 'Test Deferred',
}

type OutcomeValue = 'completed' | 'not-completed'
type VisitStatus = 'not-started' | 'in-progress' | 'ready-to-save' | 'completed'

export default function VisitDetailsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const { toast } = useToast()
  const setSelectedMember = useMemberStore(state => state.setSelectedMember)
  const [outcomes, setOutcomes] = React.useState<Record<string, OutcomeValue>>({})
  const [procedureReasons, setProcedureReasons] = React.useState<Record<string, string>>({})
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [selectedProcedure, setSelectedProcedure] = React.useState<{ id: string, title: string } | null>(null)
  const [visitStatus, setVisitStatus] = React.useState<VisitStatus>('not-started')
  const [editDialogOpen, setEditDialogOpen] = React.useState(false)
  const [editingProcedure, setEditingProcedure] = React.useState<{ id: string, title: string } | null>(null)
  const [isReopening, setIsReopening] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [savingProcedureIds, setSavingProcedureIds] = React.useState<string[]>([])
  const [saveErrorIds, setSaveErrorIds] = React.useState<string[]>([])
  const [editingCardIds, setEditingCardIds] = React.useState<string[]>([])
  const [isInitialLoad, setIsInitialLoad] = React.useState(true)
  const [hraStarted, setHraStarted] = React.useState(false)
  const [procedureMetadata, setProcedureMetadata] = React.useState<Record<string, { type: 'lab' | 'gap', apiId: string, accountId?: string }>>({})

  const { forceSaveError, toggleForceSaveError } = useForceSaveError()
  const { updateLab, updateGap} = useVisitsApi()

  // TEST FLAG: Set to true to simulate save errors for testing
  // TOAST TEST - Easy to remove: Delete this line and all FORCE_SAVE_ERROR checks
  const FORCE_SAVE_ERROR = forceSaveError

  // State to hold the visit data
  const [visitFromState, setVisitFromState] = React.useState<any>(null)
  const [isVisitDataLoaded, setIsVisitDataLoaded] = React.useState(false)
  
  // Get visitId early so it can be used in callbacks and effects
  const visitId = visitFromState?.id || params.visitId || '1'

  // Helper function to update localStorage and notify other components
  const updateVisitState = React.useCallback((visitData: any) => {
    try {
      const currentData = localStorage.getItem(`visit-state-${visitId}`)
      const newDataString = JSON.stringify(visitData)
      
      // Only update if data has actually changed
      if (currentData !== newDataString) {
        localStorage.setItem(`visit-state-${visitId}`, newDataString)
        // Dispatch custom event to notify other components (like visit cards)
        window.dispatchEvent(new CustomEvent('localStorageChange', {
          detail: { key: `visit-state-${visitId}`, value: visitData }
        }))
      }
    } catch {
      // Handle localStorage errors silently
    }
  }, [visitId])
  
  // Load visit data from navigation state or localStorage (only once)
  React.useEffect(() => {
    if (isVisitDataLoaded) return // Prevent multiple loads
    
    const visitFromNavigation = (location.state as any)?.visit
    
    if (visitFromNavigation) {
      // Use data from navigation state
      setVisitFromState(visitFromNavigation)
      
      // Store it in localStorage for future use (only if not already stored)
      if (params.visitId) {
        try {
          const existingData = localStorage.getItem(`visit-data-${params.visitId}`)
          if (!existingData) {
            localStorage.setItem(`visit-data-${params.visitId}`, JSON.stringify(visitFromNavigation))
            console.log('Visit Details: Stored visit data in localStorage for visitId:', params.visitId)
          }
        } catch (error) {
          console.log('Visit Details: Error storing visit data:', error)
        }
      }
    } else if (params.visitId) {
      // Try to get from localStorage
      try {
        const storedVisit = localStorage.getItem(`visit-data-${params.visitId}`)
        if (storedVisit) {
          const parsedVisit = JSON.parse(storedVisit)
          setVisitFromState(parsedVisit)
          console.log('Visit Details: Retrieved visit data from localStorage for visitId:', params.visitId)
        }
      } catch (error) {
        console.log('Visit Details: Error retrieving stored visit data:', error)
      }
    }
    
    // Always set loaded to true to prevent re-runs
    setIsVisitDataLoaded(true)
  }, []) // Remove dependencies to run only once
  
  const patientName = visitFromState?.patientName || 'Jane Smith'
  const address = visitFromState?.address || '1234 Main Street, Dayton, OH'
  const time = visitFromState?.time || '10:30AM'
  const insurance = visitFromState?.insurance || 'UHC'
  const visitType = visitFromState?.visitType || 'in-home'
  const visitProcedures = visitFromState?.procedures || []
  const assessmentID = visitFromState?.assessmentID || visitId // Use API assessmentID or fallback to visitId

  // Clean up stored visit data when navigating away from visits section entirely
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        localStorage.removeItem(`visit-data-${visitId}`)
      } catch {
        // Handle localStorage errors silently
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [visitId])

  // Redirect if visitId is missing from URL params (route mismatch)
  React.useEffect(() => {
    if (!params.visitId && !visitFromState?.id) {
      // If no visitId in params and no visit in state, redirect to visits page
      navigate('/visits', { replace: true })
    }
  }, [params.visitId, visitFromState?.id, navigate])


  // Load saved data from local storage and set initial visit status
  React.useEffect(() => {
    if (!isVisitDataLoaded) return // Wait for visit data to be loaded first
    
    // Load saved visit data from local storage
    try {
      const stored = localStorage.getItem(`visit-state-${visitId}`)
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
    } catch { }

    // Check if HRA has been started (from localStorage flag or HRA store)
    try {
      const hraStartedFlag = localStorage.getItem(`hra-started-${visitId}`)
      if (hraStartedFlag === 'true') {
        setHraStarted(true)
      }
    } catch { }

    // Set initial visit status from navigation state if no saved data
    if (visitFromState?.status && !localStorage.getItem(`visit-state-${visitId}`)) {
      setVisitStatus(visitFromState.status)

      // Save initial state to local storage
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
      updateVisitState(initialVisitData)
    } else if (!localStorage.getItem(`visit-state-${visitId}`)) {
      // Default to not-started if no saved data and no navigation state
      // Don't save to local storage to avoid overriding dashboard display
      setVisitStatus('not-started')
    }

    setIsInitialLoad(false)
  }, [visitId, visitFromState?.status, patientName, address, time, insurance, isVisitDataLoaded, updateVisitState])

  // Check if HRA has been started (check on component mount and when visitId changes)
  React.useEffect(() => {
    try {
      const hraStartedFlag = localStorage.getItem(`hra-started-${visitId}`)
      setHraStarted(hraStartedFlag === 'true')
    } catch { }
  }, [visitId])

  // Load procedure metadata from visit state (labs and gaps)
  React.useEffect(() => {
    if (visitFromState?.labs || visitFromState?.gaps) {
      const metadata: Record<string, { type: 'lab' | 'gap', apiId: string, accountId?: string }> = {}

      visitFromState.labs?.forEach((lab: any) => {
        const procedureId = lab.PSC_Lab_Type__c.toLowerCase().replace(/\s+/g, '-')
        metadata[procedureId] = {
          type: 'lab',
          apiId: lab.Id,
          accountId: lab.PSC_Account__c,
        }
      })

      visitFromState.gaps?.forEach((gap: any) => {
        const procedureId = `gap-${gap.PSC_Measure__c}`.toLowerCase()
        metadata[procedureId] = {
          type: 'gap',
          apiId: gap.Id,
        }
      })

      setProcedureMetadata(metadata)
    }
  }, [visitFromState])

  const handleOutcomeClick = async (procedureId: string, outcome: OutcomeValue) => {
    if (outcome === 'not-completed') {
      const procedure = procedures.find(p => p.id === procedureId)
      if (procedure) {
        setSelectedProcedure(procedure)
        setDialogOpen(true)
      }
    } else {
      setSavingProcedureIds(prev => prev.includes(procedureId) ? prev : [...prev, procedureId])

      const proposedOutcomes = {
        ...outcomes,
        [procedureId]: outcome
      }

      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitStatus === 'not-started' ? 'in-progress' : visitStatus,
        outcomes: proposedOutcomes,
        procedureReasons
      }

      try {
        if (FORCE_SAVE_ERROR) {
          throw new Error('Test error - simulating save failure')
        }

        const metadata = procedureMetadata[procedureId]
        if (metadata) {
          if (metadata.type === 'lab' && metadata.accountId) {
            const payload: UpdateLabPayload = {
              PSC_Account__c: metadata.accountId,
              Id: metadata.apiId,
              PSC_Outcome__c: 'Completed',
            }
            await updateLab(payload)
          } else if (metadata.type === 'gap') {
            const payload: UpdateGapPayload = {
              Id: metadata.apiId,
              PSC_Outcome__c: 'Completed',
            }
            await updateGap(payload)
          }
        }

        updateVisitState(visitData)
        setOutcomes(proposedOutcomes)
        setSaveErrorIds(prev => prev.filter(id => id !== procedureId))
        if (visitStatus === 'not-started') {
          setVisitStatus('in-progress')
        }
      } catch {
        setSaveErrorIds(prev => prev.includes(procedureId) ? prev : [...prev, procedureId])
        toast({
          variant: 'destructive',
          title: 'Outcomes not saved',
          description: `Outcomes not saved for ${procedures.find(p => p.id === procedureId)?.title || 'Procedure'}. Please Try Again`,
          duration: Infinity
        })
      }

      setTimeout(() => {
        setSavingProcedureIds(prev => prev.filter(id => id !== procedureId))
      }, 150)
    }
  }

  const handleDialogSave = async (reason: string, description?: string) => {
    if (selectedProcedure) {
      console.log(`Procedure ${selectedProcedure.title} not completed:`, { reason, description })
      setSavingProcedureIds(prev => prev.includes(selectedProcedure.id) ? prev : [...prev, selectedProcedure.id])

      const proposedOutcomes = {
        ...outcomes,
        [selectedProcedure.id]: 'not-completed' as OutcomeValue
      }
      const proposedReasons = {
        ...procedureReasons,
        [selectedProcedure.id]: reason
      }

      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitStatus === 'not-started' ? 'in-progress' : visitStatus,
        outcomes: proposedOutcomes,
        procedureReasons: proposedReasons
      }

      try {
        if (FORCE_SAVE_ERROR) {
          throw new Error('Test error - simulating save failure')
        }

        const metadata = procedureMetadata[selectedProcedure.id]
        const apiReason = reasonToApiReason[reason]

        if (metadata && apiReason) {
          if (metadata.type === 'lab' && metadata.accountId) {
            const payload: UpdateLabPayload = {
              PSC_Account__c: metadata.accountId,
              Id: metadata.apiId,
              PSC_Outcome__c: 'Not Completed',
              PSC_Not_Completed_Reason: apiReason,
            }
            await updateLab(payload)
          } else if (metadata.type === 'gap') {
            const payload: UpdateGapPayload = {
              Id: metadata.apiId,
              PSC_Outcome__c: 'Not Completed',
              PSC_Not_Completed_Reason__c: apiReason,
            }
            await updateGap(payload)
          }
        }

        updateVisitState(visitData)
        setOutcomes(proposedOutcomes)
        setProcedureReasons(proposedReasons)
        setSaveErrorIds(prev => prev.filter(id => id !== selectedProcedure.id))
        if (visitStatus === 'not-started') {
          setVisitStatus('in-progress')
        }
      } catch {
        setSaveErrorIds(prev => prev.includes(selectedProcedure.id) ? prev : [...prev, selectedProcedure.id])
        toast({
          variant: 'destructive',
          title: 'Outcomes not saved',
          description: `Outcomes not saved for ${selectedProcedure.title}. Please Try Again`,
          duration: Infinity
        })
      }

      setTimeout(() => {
        setSavingProcedureIds(prev => prev.filter(id => id !== selectedProcedure.id))
      }, 150)
    }
  }

  const handleEditClick = (procedureId: string) => {
    // Toggle editing mode per card (allow multiple)
    const isCurrentlyEditing = editingCardIds.includes(procedureId)
    setEditingCardIds(prev =>
      isCurrentlyEditing
        ? prev.filter(id => id !== procedureId)
        : [...prev, procedureId]
    )
    // Clear error state when entering edit mode
    if (!isCurrentlyEditing) {
      setSaveErrorIds(prev => prev.filter(id => id !== procedureId))
    }
  }

  const handleEditDialogSave = (outcome: OutcomeValue, reason?: string) => {
    if (editingProcedure) {
      // show per-procedure saving indicator
      setSavingProcedureIds(prev => prev.includes(editingProcedure.id) ? prev : [...prev, editingProcedure.id])

      // Build proposed values (no optimistic update)
      const proposedOutcomes = {
        ...outcomes,
        [editingProcedure.id]: outcome
      }
      const proposedReasons = reason ? {
        ...procedureReasons,
        [editingProcedure.id]: reason
      } : procedureReasons

      // Update session storage
      const visitData = {
        id: visitId,
        patientName,
        address,
        time,
        insurance,
        status: visitStatus,
        outcomes: proposedOutcomes,
        procedureReasons: proposedReasons
      }
      try {
        if (FORCE_SAVE_ERROR) {
          throw new Error('Test error - simulating save failure')
        }
        sessionStorage.setItem(`visit-state-${visitId}`, JSON.stringify(visitData))
        // Only on success, update UI
        setOutcomes(proposedOutcomes)
        if (reason) setProcedureReasons(proposedReasons)
        setSaveErrorIds(prev => prev.filter(id => id !== editingProcedure.id))
      } catch {
        // Do not change outcomes/state on error
        setSaveErrorIds(prev => prev.includes(editingProcedure.id) ? prev : [...prev, editingProcedure.id])
        toast({
          variant: 'destructive',
          title: 'Outcomes not saved',
          description: `Outcomes not saved for ${editingProcedure.title}. Please Try Again`,
          duration: Infinity // Never auto-dismiss, user must close manually
        })
      }
      setTimeout(() => {
        setSavingProcedureIds(prev => prev.filter(id => id !== editingProcedure.id))
      }, 150)
    }
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    // Clear error state when closing edit dialog
    if (editingProcedure) {
      setSaveErrorIds(prev => prev.filter(id => id !== editingProcedure.id))
    }
    setEditingProcedure(null)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedProcedure(null)
  }

  const completedCount = Object.values(outcomes).filter(o => o === 'completed').length
  // Count all outcomes (completed + not-completed) for progress bar
  const totalOutcomesSet = Object.values(outcomes).filter(o => o === 'completed' || o === 'not-completed').length
  // Generate procedures from API data
  const procedures = React.useMemo(() => {
    const procs: { id: string; title: string }[] = []

    // Add labs as procedures
    if (visitFromState?.labs) {
      visitFromState.labs.forEach((lab: any) => {
        const labName = lab.Mapped_Lab_Term 
          ? (Array.isArray(lab.Mapped_Lab_Term) ? lab.Mapped_Lab_Term.join(', ') : lab.Mapped_Lab_Term)
          : lab.PSC_Lab_Type__c

        procs.push({
          id: lab.PSC_Lab_Type__c.toLowerCase().replace(/\s+/g, '-'),
          title: labName
        })
      })
    }

    // Add gaps as procedures
    if (visitFromState?.gaps) {
      visitFromState.gaps.forEach((gap: any) => {
        const gapName = gap.Mapped_Gap_Term || gap.PSC_Measure__c

        procs.push({
          id: `gap-${gap.PSC_Measure__c}`.toLowerCase(),
          title: gapName
        })
      })
    }

    // Fallback to demo procedures if no API data
    if (procs.length === 0) {
      procs.push(
        { id: 'a1c', title: 'A1C' },
        { id: 'blood-pressure', title: 'Blood Pressure' },
        { id: 'urine-sample', title: 'Urine Sample' }
      )
    }

    return procs
  }, [visitFromState])

  // Total outcomes include procedures plus HRA start action
  const totalOutcomes = procedures.length + 1
  const progressPercent = Math.min(100, Math.round((totalOutcomesSet / totalOutcomes) * 100))

  // Check if all procedures and HRA have outcomes (completed or not-completed)
  const allProceduresHaveOutcomes = procedures.every(proc => outcomes[proc.id])
  const hraHasOutcome = outcomes['hra']
  const allOutcomesSet = allProceduresHaveOutcomes && hraHasOutcome

  // Update visit status based on completion - only set to ready-to-save, not completed
  // Don't auto-change status if user explicitly clicked edit
  // Removed unused isExplicitlyEditing state

  React.useEffect(() => {
    if (isInitialLoad) return // Don't auto-change status during initial load

    // If all outcomes are set, always change to ready-to-save (regardless of editing mode)
    if (allOutcomesSet && (visitStatus === 'not-started' || visitStatus === 'in-progress')) {
      setVisitStatus('ready-to-save')
    }
  }, [allOutcomesSet, visitStatus, isInitialLoad])

  // Save to local storage whenever visitStatus changes (but not during initial load)
  React.useEffect(() => {
    if (isInitialLoad || !isVisitDataLoaded) return

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
    updateVisitState(visitData)
  }, [visitStatus, outcomes, procedureReasons, visitId, patientName, address, time, insurance, isInitialLoad, isVisitDataLoaded, updateVisitState])

  const handleSaveVisit = () => {
    console.log('Saving visit...', { outcomes, procedureReasons })
    setIsSaving(true)

    // Show "Saving" for a brief moment, then complete
    setTimeout(() => {
      setIsSaving(false)
      setVisitStatus('completed')
      // Removed setIsExplicitlyEditing call

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
      updateVisitState(visitData)
    }, 1000) // Show "Saving" for 1 second
  }

  const handleEditVisit = () => {
    setIsReopening(true)

    // Show "Reopening" for a brief moment, then switch to edit mode
    setTimeout(() => {
      setIsReopening(false)
      setVisitStatus('in-progress')
      // Removed setIsExplicitlyEditing call

      // Update local storage immediately when editing
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
      updateVisitState(visitData)
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
    <div className="h-screen bg-gray-85 flex flex-col overflow-hidden">
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
                navigate('', { state: { visitData }, replace: true })
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
            {/* TOAST TEST - Easy to remove: Delete this component */}
            <ForceSaveErrorToggle
              forceSaveError={forceSaveError}
              onToggle={toggleForceSaveError}
            />
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
              <>
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
              </>
            )}


          </div>
        </div>
      </div>

      {/* Content Container - Centered with max width */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
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
                }}>Actions Captured</p>
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
                    {(() => {
                      const equipment: { name: string; procedureId: string }[] = []

                      // Generate equipment from labs
                      if (visitFromState?.labs) {
                        visitFromState.labs.forEach((lab: any) => {
                          const labType = lab.PSC_Lab_Type__c
                          let equipmentName = ''
                          let procedureId = ''

                          switch (labType) {
                            case 'KED':
                              equipmentName = 'Kidney Function Kit'
                              procedureId = 'ked'
                              break
                            case 'HbA1c':
                            case 'A1C':
                              equipmentName = 'HbA1c Kit'
                              procedureId = 'a1c'
                              break
                            case 'Lipid Panel':
                              equipmentName = 'Lipid Panel Kit'
                              procedureId = 'lipid-panel'
                              break
                            default:
                              equipmentName = `${labType} Kit`
                              procedureId = labType.toLowerCase().replace(/\s+/g, '-')
                          }

                          // Only show if not completed by backend
                          const isBackendCompleted = lab.PSC_Status__c === 'Completed'
                          if (!isBackendCompleted) {
                            equipment.push({ name: equipmentName, procedureId })
                          }
                        })
                      }

                      // Generate equipment from gaps
                      if (visitFromState?.gaps) {
                        visitFromState.gaps.forEach((gap: any) => {
                          const gapType = gap.PSC_Measure__c
                          let equipmentName = ''
                          let procedureId = ''

                          switch (gapType) {
                            case 'EED':
                              equipmentName = 'Retinal Camera'
                              procedureId = 'eed'
                              break
                            case 'EKG':
                            case 'ECG':
                              equipmentName = 'Portable ECG/EKG'
                              procedureId = 'ekg'
                              break
                            default:
                              equipmentName = `${gapType} Equipment`
                              procedureId = gapType.toLowerCase().replace(/\s+/g, '-')
                          }

                          // Only show if not completed by backend
                          const isBackendCompleted = gap.PSC_Status__c === 'Completed'
                          if (!isBackendCompleted) {
                            equipment.push({ name: equipmentName, procedureId })
                          }
                        })
                      }

                      // Fallback to demo equipment if no API data
                      if (equipment.length === 0) {
                        equipment.push(
                          { name: 'A1C Kit', procedureId: 'a1c' },
                          { name: 'Blood Pressure Monitor', procedureId: 'blood-pressure' },
                          { name: 'Urine Collection Kit', procedureId: 'urine-sample' }
                        )
                      }

                      return equipment.map((equip, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs"
                          style={{
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            color: '#1B1B1B'
                          }}
                        >
                          {equip.name}
                        </span>
                      ))
                    })()}
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
                {(() => {
                  const hraCompleted = outcomes['hra'] === 'completed'
                  return hraCompleted ? (
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
                            <path d="M6.5 11.3L3.5 8.3L4.55 7.25L6.5 9.2L11.45 4.25L12.5 5.3L6.5 11.3Z" fill="white" />
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
                          className="w-full flex items-center justify-center gap-2 font-semibold transition-all duration-250 ease-out mt-4"
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
                            margin: '12px 0 0 0',
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
                            <path d="M4.5 20C3.95 20 3.475 19.8083 3.075 19.425C2.69167 19.025 2.5 18.55 2.5 18V6C2.5 5.45 2.69167 4.98333 3.075 4.6C3.475 4.2 3.95 4 4.5 4H16.5C17.05 4 17.5167 4.2 17.9 4.6C18.3 4.98333 18.5 5.45 18.5 6V10.5L22.5 6.5V17.5L18.5 13.5V18C18.5 18.55 18.3 19.025 17.9 19.425C17.5167 19.8083 17.05 20 16.5 20H4.5ZM4.5 18H16.5V6H4.5V18ZM4.5 18V6V18Z" fill="#239BCF" />
                          </svg>
                          <span>Start Telehealth</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          // Mark HRA as started in localStorage
                          try {
                            localStorage.setItem(`hra-started-${visitId}`, 'true')
                            setHraStarted(true)
                          } catch { }

                          // Mark HRA as started in outcomes (for progress bar update)
                          // Only mark if not already completed
                          if (!outcomes['hra']) {
                            const updatedOutcomes = {
                              ...outcomes,
                              'hra': 'not-completed' as OutcomeValue // Mark as not-completed initially to update progress
                            }
                            setOutcomes(updatedOutcomes)

                            // Save to localStorage
                            const visitData = {
                              id: visitId,
                              patientName,
                              address,
                              time,
                              insurance,
                              status: visitStatus === 'not-started' ? 'in-progress' : visitStatus,
                              outcomes: updatedOutcomes,
                              procedureReasons
                            }
                            updateVisitState(visitData)

                            // Update visit status if needed
                            if (visitStatus === 'not-started') {
                              setVisitStatus('in-progress')
                            }
                          }

                          // Prepare member data
                          const memberData = {
                            id: visitId,
                            firstName: patientName.split(' ')[0] || '',
                            lastName: patientName.split(' ').slice(1).join(' ') || '',
                            address: address,
                            phone: '',
                            assessmentId: assessmentID, // Use the correct assessmentID from API
                            isStarted: hraStarted || hraCompleted || outcomes['hra'] === 'not-completed',
                            isCompleted: hraCompleted,
                          }

                          // Set member data in store
                          setSelectedMember(memberData)

                          // Store visit data in localStorage before navigating to HRA (only if not already stored)
                          // This ensures we can retrieve the API data when returning from HRA
                          if (visitFromState) {
                            try {
                              const existingData = localStorage.getItem(`visit-data-${visitId}`)
                              if (!existingData) {
                                localStorage.setItem(`visit-data-${visitId}`, JSON.stringify(visitFromState))
                                console.log('Visit Details: Stored visit data before HRA navigation for visitId:', visitId)
                              }
                            } catch (error) {
                              console.log('Visit Details: Error storing visit data before HRA navigation:', error)
                            }
                          }

                          // Navigate to HRA page with member data in state
                          navigate('/hra', {
                            state: { member: memberData }
                          })
                        }}
                        className="w-full bg-[#5538A6] hover:bg-[#4A2F95] text-white font-medium py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.99]"
                        aria-pressed={false}
                      >
                        <span>{hraStarted ? 'Continue HRA Assessment' : 'Start HRA Assessment'}</span>
                        <Folder className="w-5 h-5" />
                      </button>

                      {/* Also show Start Telehealth alongside HRA for telehealth visits */}
                      {visitType === 'telehealth' && (
                        <button
                          onClick={() => {
                            console.log('Starting telehealth session...')
                          }}
                          className="w-full flex items-center justify-center gap-2 font-semibold transition-all duration-250 ease-out mt-4"
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
                            margin: '12px 0 0 0',
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
                            <path d="M4.5 20C3.95 20 3.475 19.8083 3.075 19.425C2.69167 19.025 2.5 18.55 2.5 18V6C2.5 5.45 2.69167 4.98333 3.075 4.6C3.475 4.2 3.95 4 4.5 4H16.5C17.05 4 17.5167 4.2 17.9 4.6C18.3 4.98333 18.5 5.45 18.5 6V10.5L22.5 6.5V17.5L18.5 13.5V18C18.5 18.55 18.3 19.025 17.9 19.425C17.5167 19.8083 17.05 20 16.5 20H4.5ZM4.5 18H16.5V6H4.5V18ZM4.5 18V6V18Z" fill="#239BCF" />
                          </svg>
                          <span>Start Telehealth</span>
                        </button>
                      )}
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Procedures */}
          <div data-procedures-section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {procedures
                .map((procedure) => {
                  const outcome = outcomes[procedure.id]
                  const reason = procedureReasons[procedure.id]
                  
                  // Check if this procedure is completed from backend
                  const backendProcedure = visitProcedures.find((p: any) => {
                    const procedureIdMap: Record<string, string> = {
                      'A1C': 'a1c',
                      'HbA1c Test': 'a1c',
                      'Blood Pressure': 'blood-pressure',
                      'Urine Sample': 'urine-sample',
                      'Lipid Panel': 'lipid-panel'
                    }
                    const procedureId = procedureIdMap[p.name] || p.name.toLowerCase().replace(/\s+/g, '-')
                    return procedureId === procedure.id
                  })
                  const isBackendCompleted = backendProcedure?.completed === true
                  
                  // Use backend status if available, otherwise use local outcome
                  const displayOutcome = isBackendCompleted ? 'completed' : outcome

                  return (
                    <div key={procedure.id} className={`bg-white rounded-2xl shadow-sm p-6 transition-shadow duration-300 hover:shadow-md relative ${editingCardIds.includes(procedure.id) ? 'flex flex-col' : ''}`}>
                      {/* Error Icon - top-right corner - show exclamation mark even when editing */}
                      {saveErrorIds.includes(procedure.id) && !editingCardIds.includes(procedure.id) && !savingProcedureIds.includes(procedure.id) && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center z-10">
                          <span className="text-white text-[12px] font-bold leading-none">!</span>
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <h3 className="text-base font-semibold text-gray-900 flex-1 min-w-0 pr-2 leading-tight">{procedure.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Status Badge - show when outcome exists */}
                          {displayOutcome && !editingCardIds.includes(procedure.id) && (
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
                                backgroundColor: displayOutcome === 'completed' ? 'rgb(25, 154, 146)' : 'rgb(207, 35, 35)',
                                color: 'rgb(255, 255, 255)',
                                fontWeight: '500',
                                whiteSpace: 'nowrap',
                                transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                outline: '0px',
                                textDecoration: 'none',
                                padding: '0px',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: displayOutcome === 'completed' ? 'rgba(25, 154, 146, 0.7)' : 'rgba(207, 35, 35, 0.7)',
                                borderRadius: '24px',
                                minWidth: '120px'
                              }}
                            >
                              {displayOutcome === 'completed' ? (
                                <>
                                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                      <path d="M6.5 11.3L3.5 8.3L4.55 7.25L6.5 9.2L11.45 4.25L12.5 5.3L6.5 11.3Z" fill="#15827B" />
                                    </svg>
                                  </div>
                                  <span>Completed</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="none">
                                      <path d="M5.12 12L8 9.12L10.88 12L12 10.88L9.12 8L12 5.12L10.88 4L8 6.88L5.12 4L4 5.12L6.88 8L4 10.88L5.12 12Z" fill="#CF2323" />
                                    </svg>
                                  </div>
                                  <span>Not Completed</span>
                                </>
                              )}
                            </div>
                          )}
                          
                          {/* Backend Completed Indicator */}
                          {isBackendCompleted && (
                            <div
                              className="inline-flex items-center justify-center text-xs font-medium whitespace-nowrap px-3"
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
                                backgroundColor: 'rgb(243, 244, 246)',
                                color: 'rgb(107, 114, 128)',
                                transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                outline: '0px',
                                textDecoration: 'none',
                                padding: '0px',
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderRadius: '24px',
                                borderColor: 'rgb(209, 213, 219)',
                                minWidth: '80px'
                              }}
                            >
                              System Completed
                            </div>
                          )}
                          
                          {/* Saving indicator - show briefly after outcome selection */}


                          {/* Editing Badge - show when this card is being edited */}
                          {editingCardIds.includes(procedure.id) && (
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
                          {/* Edit/Close Button - show when Save button is visible at top and procedure has outcome, but not for backend completed */}
                          {(visitStatus === 'in-progress' || visitStatus === 'ready-to-save' || needsSaving) && displayOutcome && !editingCardIds.includes(procedure.id) && !isBackendCompleted && (
                            savingProcedureIds.includes(procedure.id)
                              ? (
                                <div
                                  className="w-8 h-8 flex items-center justify-center"
                                  title="Saving"
                                >
                                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                                </div>
                              )
                              : (
                                <button
                                  onClick={() => handleEditClick(procedure.id)}
                                  className="p-1.5 transition-colors hover:bg-gray-100 rounded-2xl"
                                  title="Edit status"
                                >
                                  <Pencil className="w-4 h-4 text-gray-500" />
                                </button>
                              )
                          )}
                          {/* Close button when editing */}
                          {editingCardIds.includes(procedure.id) && (
                            <button
                              onClick={() => handleEditClick(procedure.id)}
                              className="p-1.5 transition-colors"
                              title="Close editing"
                            >
                              <X className="w-4 h-4 text-gray-500 hover:text-red-700 transition-colors" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Edit Mode Message - only show when this specific card is being edited */}
                      {editingCardIds.includes(procedure.id) && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            className="flex-shrink-0"
                          >
                            <path d="M10 15C10.2833 15 10.5208 14.9042 10.7125 14.7125C10.9042 14.5208 11 14.2833 11 14C11 13.7167 10.9042 13.4792 10.7125 13.2875C10.5208 13.0958 10.2833 13 10 13C9.71667 13 9.47917 13.0958 9.2875 13.2875C9.09583 13.4792 9 13.7167 9 14C9 14.2833 9.09583 14.5208 9.2875 14.7125C9.47917 14.9042 9.71667 15 10 15ZM9 11H11V5H9V11ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z" fill="#239BCF" />
                          </svg>
                          <span className="text-sm text-gray-600">Editing mode - Select outcome and save changes</span>
                        </div>
                      )}

                      {/* Show reason for not completed procedures */}
                      {displayOutcome === 'not-completed' && reason && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Reason:</p>
                          <p className="text-sm text-gray-700">{reasonLabels[reason] || reason}</p>
                        </div>
                      )}



                      {/* Action buttons - show when this card is being edited or when no outcome set, but not for backend completed */}
                      {(editingCardIds.includes(procedure.id) || (!displayOutcome && !isBackendCompleted)) && (
                        <div>
                          <div>
                            <p className="text-sm text-gray-600 mb-3">Outcome:</p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  handleOutcomeClick(procedure.id, 'completed')
                                  if (editingCardIds.includes(procedure.id)) {
                                    setEditingCardIds(prev => prev.filter(id => id !== procedure.id)) // Close editing after selection
                                  }
                                }}
                                className="flex-1"
                                disabled={savingProcedureIds.includes(procedure.id)}
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
                                  backgroundColor: displayOutcome === 'completed' ? 'rgb(25, 154, 146)' : 'white',
                                  color: displayOutcome === 'completed' ? 'rgb(255, 255, 255)' : 'rgb(107, 114, 128)',
                                  cursor: savingProcedureIds.includes(procedure.id) ? 'not-allowed' : 'pointer',
                                  margin: '0px',
                                  whiteSpace: 'nowrap',
                                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                  outline: '0px',
                                  textDecoration: 'none',
                                  border: displayOutcome === 'completed' ? '0px' : '1px solid rgb(209, 213, 219)',
                                  padding: '0px',
                                  borderRadius: '999px',
                                  opacity: savingProcedureIds.includes(procedure.id) ? '0.6' : '1'
                                }}
                              >
                                Completed
                              </button>
                              <button
                                onClick={() => {
                                  handleOutcomeClick(procedure.id, 'not-completed')
                                  if (editingCardIds.includes(procedure.id)) {
                                    setEditingCardIds(prev => prev.filter(id => id !== procedure.id)) // Close editing after selection
                                  }
                                }}
                                className="flex-1"
                                disabled={savingProcedureIds.includes(procedure.id)}
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
                                  backgroundColor: displayOutcome === 'not-completed' ? 'rgb(207, 35, 35)' : 'white',
                                  color: displayOutcome === 'not-completed' ? 'rgb(255, 255, 255)' : 'rgb(107, 114, 128)',
                                  cursor: savingProcedureIds.includes(procedure.id) ? 'not-allowed' : 'pointer',
                                  margin: '0px',
                                  whiteSpace: 'nowrap',
                                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                  outline: '0px',
                                  textDecoration: 'none',
                                  border: displayOutcome === 'not-completed' ? '0px' : '1px solid rgb(209, 213, 219)',
                                  padding: '0px',
                                  borderRadius: '999px',
                                  opacity: savingProcedureIds.includes(procedure.id) ? '0.6' : '1'
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
            className={`w-full p-3 rounded-2xl border text-left ${selectedOutcome === 'completed'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-300 hover:bg-gray-50'
              }`}
          >
            Completed
          </button>

          <button
            onClick={() => setSelectedOutcome('not-completed')}
            className={`w-full p-3 rounded-2xl border text-left ${selectedOutcome === 'not-completed'
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


export { VisitDetailsView }