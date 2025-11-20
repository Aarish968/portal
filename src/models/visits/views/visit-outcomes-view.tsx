import React from 'react'
import { ArrowLeft, Clock, MapPin, Building, CheckCircle, FileText, Bell, X, Link, Check } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

// Seed data for today's visits (starts as not-started and updates via navigation state)
const completedVisits = [
  {
    id: 'visit-1',
    patientName: 'Jane Smith',
    visitTime: '10:30AM',
    address: '1234 Main Street, Dayton, OH',
    insurance: 'UHC',
    visitType: 'In-Home Visit',
    status: 'not-started',
    completedProcedures: [
      { name: 'A1C', status: 'not-completed' },
      { name: 'Blood Pressure', status: 'not-completed' },
      { name: 'Urine Sample', status: 'not-completed' }
    ],
    hraStatus: 'in-progress'
  }
]

const consentForms = [
  { id: 'hipaa', name: 'HIPAA Authorization', key: 'hipaa' },
  { id: 'privacy', name: 'Notice of Privacy Practices', key: 'privacy' },
  { id: 'treatment', name: 'Treatment Consent', key: 'treatment' },
]

export default function VisitOutcomesView() {
  const navigate = useNavigate()
  const location = useLocation()

  // Get visit data from navigation state
  const visitDataFromState = (location.state as any)?.visitData

  // Force re-render when location state changes
  React.useEffect(() => {
    // This will trigger re-render when coming back from visit details
  }, [location.state])

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Merge persisted session state for the same visit id if present
  const persisted = (() => {
    try {
      const id = visitDataFromState?.id || '1'
      const stored = sessionStorage.getItem(`visit-state-${id}`)
      console.log('Loading visit data for ID:', id, 'Data:', stored)
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })()

  // Load all visits and merge with session storage data
  const getAllVisits = () => {
    // Get all possible visit IDs from session storage
    const visitIds = ['1', '2', '3', '4'] // Add more IDs as needed

    return visitIds.map(id => {
      try {
        const stored = sessionStorage.getItem(`visit-state-${id}`)
        if (stored) {
          const data = JSON.parse(stored)
          return {
            id: data.id,
            patientName: data.patientName,
            visitTime: data.time,
            address: data.address,
            insurance: data.insurance,
            visitType: 'In-Home Visit',
            status: data.status,
            completedProcedures: [
              { name: 'A1C', status: data.outcomes?.['a1c'] || 'not-completed' },
              { name: 'Blood Pressure', status: data.outcomes?.['blood-pressure'] || 'not-completed' },
              { name: 'Urine Sample', status: data.outcomes?.['urine-sample'] || 'not-completed' }
            ],
            hraStatus: data.outcomes?.hra === 'completed' ? 'completed' : 'not-started'
          }
        }
      } catch { }
      return null
    }).filter(Boolean)
  }

  const source = visitDataFromState || persisted
  const visits = source ? [{
    id: source.id,
    patientName: source.patientName,
    visitTime: source.time,
    address: source.address,
    insurance: source.insurance,
    visitType: 'In-Home Visit',
    status: source.status,
    completedProcedures: [
      { name: 'A1C', status: source.outcomes?.['a1c'] || 'not-completed' },
      { name: 'Blood Pressure', status: source.outcomes?.['blood-pressure'] || 'not-completed' },
      { name: 'Urine Sample', status: source.outcomes?.['urine-sample'] || 'not-completed' }
    ],
    hraStatus: source.outcomes?.hra === 'completed' ? 'completed' : 'not-started'
  }] : getAllVisits().length > 0 ? getAllVisits() : completedVisits

  const handleViewSummary = (visitId: string) => {
    const visit = visits.find(v => v?.id === visitId)
    if (visit) {
      // Navigate to visit details with proper state
      navigate(`/visit-details/${visitId}`, {
        state: {
          visit: {
            id: visit.id,
            patientName: visit.patientName,
            time: visit.visitTime,
            address: visit.address,
            insurance: visit.insurance,
            status: visit.status
          },
          fromOutcomes: true // Flag to indicate we came from outcomes page
        }
      })
    }
  }

  const handleLogOutcomes = (visitId: string) => {
    const visit = visits.find(v => v?.id === visitId)
    if (visit) {
      navigate(`/visit-details/${visitId}`, {
        state: {
          visit: {
            id: visit.id,
            patientName: visit.patientName,
            time: visit.visitTime,
            address: visit.address,
            insurance: visit.insurance,
            status: visit.status === 'not-started' ? 'not-started' : 'in-progress'
          },
          fromOutcomes: true
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/visits', { replace: true })} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Visit Outcomes</h1>
              <p className="text-sm text-gray-500">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{currentTime}</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 mb-8 border-b border-gray-200">
          <button className="pb-3 border-b-2 border-blue-500 text-blue-600 font-medium">
            Today
          </button>
          <button className="pb-3 text-gray-500 hover:text-gray-700 font-medium">
            Next 14 Days
          </button>
        </div>

        {/* Today's Visits */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Today's Visits</h2>
          <div className="space-y-6">
            {visits.filter(visit => visit != null).map((visit) => (
              <div key={visit.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    {/* Patient Name and Status */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{visit.patientName}</h3>
                      {visit.status === 'completed' ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      ) : visit.status === 'in-progress' ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          <span>In Progress</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                          <span>Not Started</span>
                        </div>
                      )}
                    </div>

                    {/* Visit Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{visit.visitTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{visit.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        <span>{visit.insurance}</span>
                      </div>
                    </div>

                    {/* Visit Type */}
                    <div className="mb-6">
                      <div className="px-3 py-1.5 border border-purple-600 text-purple-600 bg-white rounded-full text-sm font-medium w-fit">
                        {visit.visitType}
                      </div>
                    </div>

                    {/* Completed Procedures */}
                    <div className="mb-4">
                      <h4 className="text-sm text-gray-500 mb-3">Visit Procedures:</h4>
                      <div className="flex flex-wrap gap-2">
                        {visit.completedProcedures
                          .filter((procedure) => {
                            // Hide completed procedures, only show incomplete or not-started ones
                            return procedure.status !== 'completed'
                          })
                          .map((procedure, index) => {
                          const isCompleted = procedure.status === 'completed'
                          return (
                            <div
                              key={index}
                              className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
                              style={{
                                maxWidth: '100%',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                lineHeight: '1.5',
                                cursor: 'unset',
                                verticalAlign: 'middle',
                                boxSizing: 'border-box',
                                height: '32px',
                                fontWeight: '500',
                                fontSize: '0.75rem',
                                backgroundColor: isCompleted ? 'rgb(25, 154, 146)' : 'rgb(207, 35, 35)',
                                color: 'rgb(255, 255, 255)',
                                whiteSpace: 'nowrap',
                                transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                outline: '0px',
                                textDecoration: 'none',
                                border: '0px',
                                padding: '0px 12px',
                                borderRadius: '999px'
                              }}
                            >
                              {isCompleted ? (
                                <>
                                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-3 h-3" style={{ color: 'rgb(25, 154, 146)' }} />
                                  </div>
                                  <span>{procedure.name}</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    <X className="w-3 h-3" style={{ color: 'rgb(207, 35, 35)' }} />
                                  </div>
                                  <span>{procedure.name}</span>
                                </>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Health Risk Assessment */}
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">Health Risk Assessment:</h4>
                      {visit.hraStatus === 'completed' ? (
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium w-fit">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium w-fit">
                          <FileText className="w-4 h-4" />
                          <span>In Progress</span>
                        </div>
                      )}
                    </div>

                    {/* Consent Forms Section */}
                    <div className="mb-4">
                      <h4 className="text-sm text-gray-500 mb-3">Consent forms</h4>
                      <div className="space-y-3">
                        {consentForms.map((form) => {
                          // Get consent status from sessionStorage
                          let isCompleted = false
                          try {
                            const consentData = sessionStorage.getItem(`consentFormsStatus-${visit.id}`)
                            if (consentData) {
                              const consent = JSON.parse(consentData)
                              isCompleted = consent[form.key] === true
                            }
                          } catch {}
                          
                          return (
                            <div key={form.id} className="flex flex-col gap-1">
                              {isCompleted ? (
                                <div className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full w-fit mb-1" style={{
                                  maxWidth: '100%',
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  lineHeight: '1.5',
                                  cursor: 'unset',
                                  verticalAlign: 'middle',
                                  boxSizing: 'border-box',
                                  height: '24px',
                                  fontWeight: '500',
                                  fontSize: '0.75rem',
                                  backgroundColor: 'rgb(25, 154, 146)',
                                  color: 'rgb(255, 255, 255)',
                                  whiteSpace: 'nowrap',
                                  transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                                  outline: '0px',
                                  textDecoration: 'none',
                                  border: '0px',
                                  padding: '0px 12px',
                                  borderRadius: '999px'
                                }}>
                                  <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                    <Check className="w-2 h-2" style={{ color: 'rgb(25, 154, 146)' }} />
                                  </div>
                                  <span>Collected</span>
                                </div>
                              ) : (
                                <span className="text-xs font-medium mb-1" style={{
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  color: 'rgb(207, 35, 35)'
                                }}>
                                  Missing
                                </span>
                              )}
                              <p className="text-sm text-gray-900" style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontSize: '0.875rem',
                                color: '#1B1B1B'
                              }}>
                                {form.name}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="ml-6 flex flex-col gap-3">
                    {(() => {
                      // Get individual visit session storage data
                      const getVisitData = () => {
                        try {
                          const stored = sessionStorage.getItem(`visit-state-${visit.id}`)
                          return stored ? JSON.parse(stored) : null
                        } catch { return null }
                      }

                      // Check consent status
                      const consentStatus = (() => {
                        try {
                          const consentData = sessionStorage.getItem(`consentFormsStatus-${visit.id}`)
                          if (consentData) {
                            const consent = JSON.parse(consentData)
                            return {
                              hipaa: consent.hipaa === true,
                              privacy: consent.privacy === true,
                              treatment: consent.treatment === true
                            }
                          }
                        } catch {}
                        return {
                          hipaa: false,
                          privacy: false,
                          treatment: false
                        }
                      })()
                      
                      const completedCount = Object.values(consentStatus).filter(Boolean).length
                      const hasAnyConsentCompleted = completedCount > 0
                      const allConsentsCompleted = completedCount === 3

                      // Function to copy consent link
                      const handleCopyConsentLink = () => {
                        const consentLink = `${window.location.origin}/consent-forms?visitId=${visit.id}`
                        navigator.clipboard.writeText(consentLink).then(() => {
                          console.log('Consent link copied to clipboard')
                        })
                      }

                      const visitData = getVisitData()
                      const hasOutcomes = visitData?.outcomes && Object.keys(visitData.outcomes).length > 0
                      const sessionStatus = visitData?.status

                      if (sessionStatus === 'completed') {
                        return (
                          <button
                            onClick={() => handleViewSummary(visit.id)}
                            className="px-4 py-2 border border-[#5538A6] text-[#5538A6] bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="w-4 h-4 inline mr-2" />
                            View Summary
                          </button>
                        )
                      } else if (hasOutcomes || visit.status === 'in-progress') {
                        return (
                          <button
                            onClick={() => handleLogOutcomes(visit.id)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                          >
                            Continue Visit
                          </button>
                        )
                      } else {
                        // Show buttons based on consent completion status
                        if (allConsentsCompleted) {
                          // All 3 consents completed - show only Log Outcomes
                          return (
                            <button
                              onClick={() => handleLogOutcomes(visit.id)}
                              className="px-4 py-2 bg-[#5538A6] hover:bg-[#4A2F95] text-white rounded-lg font-medium transition-colors"
                              style={{
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                borderRadius: '12px'
                              }}
                            >
                              Log Outcomes
                            </button>
                          )
                        } else if (hasAnyConsentCompleted) {
                          // 1 or 2 consents completed - show Log Outcomes and Copy Consent Link
                          return (
                            <>
                              <button
                                onClick={() => handleLogOutcomes(visit.id)}
                                className="px-4 py-2 bg-[#5538A6] hover:bg-[#4A2F95] text-white rounded-lg font-medium transition-colors"
                                style={{
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                  borderRadius: '12px'
                                }}
                              >
                                Log Outcomes
                              </button>
                              <button
                                onClick={handleCopyConsentLink}
                                className="px-4 py-2 bg-[#5538A6] hover:bg-[#4A2F95] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                style={{
                                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                  borderRadius: '12px'
                                }}
                              >
                                Copy Consent Link
                                <Link className="w-4 h-4" />
                              </button>
                              <p className="text-xs text-gray-500 mt-1" style={{ 
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                                fontSize: '0.75rem',
                                marginTop: '4px'
                              }}>
                                Copies link to paste in Telehealth chat
                              </p>
                            </>
                          )
                        } else {
                          // No consents completed - show only Log Outcomes
                          return (
                            <button
                              onClick={() => handleLogOutcomes(visit.id)}
                              className="px-4 py-2 bg-[#5538A6] hover:bg-[#4A2F95] text-white rounded-lg font-medium transition-colors"
                            >
                              Log Outcomes
                            </button>
                          )
                        }
                      }
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
