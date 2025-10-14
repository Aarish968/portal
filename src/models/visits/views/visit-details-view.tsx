import React from 'react'
import { ArrowLeft, MapPin, Clock, Play, CheckCircle, Check, X, Pencil, FileText, Building } from 'lucide-react'
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

  // Extract visit either from navigation state or fallback to param id
  const visitFromState = (location.state as any)?.visit
  const visitId = visitFromState?.id || params.visitId || '1'
  const patientName = visitFromState?.patientName || 'Jane Smith'
  const address = visitFromState?.address || '1234 Main Street, Dayton, OH'
  const time = visitFromState?.time || '10:30AM'
  const insurance = visitFromState?.insurance || 'UHC'
  const statusLabel = visitFromState?.status === 'in-progress' ? 'In Progress' : visitFromState?.status === 'completed' ? 'Completed' : 'Not Started'
  
  // Set initial visit status from navigation state
  React.useEffect(() => {
    if (visitFromState?.status) {
      setVisitStatus(visitFromState.status)
    }
  }, [visitFromState?.status])

  const handleOutcomeClick = (procedureId: string, outcome: OutcomeValue) => {
    if (outcome === 'not-completed') {
      const procedure = procedures.find(p => p.id === procedureId)
      if (procedure) {
        setSelectedProcedure(procedure)
        setDialogOpen(true)
      }
    } else {
      setOutcomes(prev => ({
        ...prev,
        [procedureId]: outcome
      }))
      // When HRA is started, change status to in-progress
      if (procedureId === 'hra' && visitStatus === 'not-started') {
        setVisitStatus('in-progress')
      }
    }
  }

  const handleDialogSave = (reason: string, description?: string) => {
    if (selectedProcedure) {
      console.log(`Procedure ${selectedProcedure.title} not completed:`, { reason, description })
      setOutcomes(prev => ({
        ...prev,
        [selectedProcedure.id]: 'not-completed'
      }))
      setProcedureReasons(prev => ({
        ...prev,
        [selectedProcedure.id]: reason
      }))
    }
  }

  const handleEditClick = (procedureId: string) => {
    const procedure = procedures.find(p => p.id === procedureId)
    if (procedure) {
      setSelectedProcedure(procedure)
      setDialogOpen(true)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedProcedure(null)
  }

  const completedCount = Object.values(outcomes).filter(o => o === 'completed').length
  // Total outcomes include procedures plus HRA start action
  const totalOutcomes = procedures.length + 1
  const progressPercent = Math.min(100, Math.round((completedCount / totalOutcomes) * 100))

  // Check if all procedures and HRA have outcomes (completed or not-completed)
  const allProceduresHaveOutcomes = procedures.every(proc => outcomes[proc.id])
  const hraHasOutcome = outcomes['hra']
  const allOutcomesSet = allProceduresHaveOutcomes && hraHasOutcome

  // Update visit status based on completion
  React.useEffect(() => {
    if (allOutcomesSet && (visitStatus === 'in-progress' || visitStatus === 'not-started')) {
      setVisitStatus('ready-to-save')
    }
  }, [allOutcomesSet, visitStatus])

  const handleSaveVisit = () => {
    console.log('Saving visit...', { outcomes, procedureReasons })
    setVisitStatus('completed')
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
    // Stay on current page - don't navigate away
  }

  const handleEditVisit = () => {
    setVisitStatus('in-progress')
  }

  const handleViewSummary = () => {
    // Pass visit data to outcomes page
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
  }




  return (
    <div className="h-full bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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
            }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Visit Details</h1>
              <p className="text-sm text-gray-500">{patientName} - {address}</p>
            </div>
          </div>
          
          {/* Dynamic Header Buttons */}
          <div className="flex items-center gap-3">
            {visitStatus === 'ready-to-save' && (
              <>
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                  <span className="text-sm font-medium">Ready to Save</span>
                </div>
                <button
                  onClick={handleSaveVisit}
                  className="px-6 py-2 bg-[#5538A6] hover:bg-[#4A2F95] text-white rounded-lg font-medium transition-colors"
                >
                  Save
                </button>
              </>
            )}
            
            {visitStatus === 'completed' && (
              <>
                <div className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg">
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <button
                  onClick={handleEditVisit}
                  className="px-4 py-2 border border-[#5538A6] text-[#5538A6] bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <Pencil className="w-4 h-4 inline mr-2" />
                  Edit
                </button>
              </>
            )}
            
            {visitStatus === 'not-started' && (
              <div className="px-4 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Not Started</span>
              </div>
            )}
            
            {visitStatus === 'in-progress' && (
              <div className="px-4 py-2 bg-orange-100 rounded-lg">
                <span className="text-sm font-medium text-orange-700">In Progress</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Patient Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{patientName}</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-500">ID: {visitId}</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{insurance}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="px-3 py-1.5 border border-purple-600 text-purple-600 bg-white rounded-full text-sm font-medium w-fit">
                  In-Home Visit
                </div>
              </div>
            </div>

            {/* Visit Progress */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Visit Progress</h3>
              <p className="text-sm text-gray-600 mb-2">Outcomes Captured</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-2 bg-gray-900 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <span className="text-base font-semibold text-gray-900">{completedCount}/{totalOutcomes}</span>
              </div>
              
              <div className="mt-6">
                <h4 className="text-base font-semibold text-gray-900 mb-3">Equipment Needed</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-gray-700">
                    A1C Kit
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-gray-700">
                    Blood Pressure Monitor
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-gray-700">
                    Urine Collection Kit
                  </span>
                </div>
              </div>
            </div>

            {/* HRA Assessment */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">HRA Assessment</h3>
              <p className="text-sm text-gray-500 mb-4">Health Risk Assessment questionnaire</p>
              {outcomes['hra'] === 'completed' ? (
                <div className="flex items-center gap-2 text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5" />
                  <span>Assessment Complete</span>
                </div>
              ) : (
                <button
                  onClick={() => handleOutcomeClick('hra', 'completed')}
                  className="w-full bg-[#5538A6] hover:bg-[#4A2F95] text-white font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-[0.99]"
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
                <div key={procedure.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">{procedure.title}</h3>
                    {outcome && (
                      <div className="flex items-center gap-2">
                        {/* Status Badge */}
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                          outcome === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {outcome === 'completed' ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Completed</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              <span>Not Completed</span>
                            </>
                          )}
                        </div>
                        {/* Edit Button - show for both completed and not-completed when visit is completed */}
                        {visitStatus === 'completed' && (
                          <button
                            onClick={() => handleEditClick(procedure.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit status"
                          >
                            <Pencil className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Show reason for not completed procedures */}
                  {outcome === 'not-completed' && reason && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Reason:</p>
                      <p className="text-sm text-gray-700">{reasonLabels[reason] || reason}</p>
                    </div>
                  )}
                  
                  {/* Action buttons - only show if no outcome set */}
                  {!outcome && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">Outcome:</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOutcomeClick(procedure.id, 'completed')}
                          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Completed
                        </button>
                        <button
                          onClick={() => handleOutcomeClick(procedure.id, 'not-completed')}
                          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Not Completed
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
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