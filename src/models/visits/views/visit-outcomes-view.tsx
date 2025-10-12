import React from 'react'
import { ArrowLeft, Clock, MapPin, Building, CheckCircle, FileText, Bell } from 'lucide-react'
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
      return JSON.parse(sessionStorage.getItem(`visit-state-${id}`) || 'null')
    } catch { return null }
  })()

  // Use visit data from state or persisted, otherwise use defaults
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
      { name: 'A1C', status: source.outcomes?.['a1c'] === 'completed' ? 'completed' : 'not-completed' },
      { name: 'Blood Pressure', status: source.outcomes?.['blood-pressure'] === 'completed' ? 'completed' : 'not-completed' },
      { name: 'Urine Sample', status: source.outcomes?.['urine-sample'] === 'completed' ? 'completed' : 'not-completed' }
    ],
    hraStatus: source.outcomes?.hra === 'completed' ? 'completed' : 'in-progress'
  }] : completedVisits

  const handleViewSummary = (visitId: string) => {
    const visit = visits.find(v => v.id === visitId)
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
    const visit = visits.find(v => v.id === visitId)
    if (visit) {
      navigate(`/visit-details/${visitId}`, {
        state: {
          visit: {
            id: visit.id,
            patientName: visit.patientName,
            time: visit.visitTime,
            address: visit.address,
            insurance: visit.insurance,
            status: 'in-progress'
          },
          fromOutcomes: true
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/visits', { replace: true })} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">Visit Outcomes</h1>
              <p className="text-sm text-gray-500 truncate">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-end">
            <span className="text-sm text-gray-500 whitespace-nowrap">{currentTime}</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs - Responsive */}
        <div className="flex gap-4 sm:gap-8 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <button className="pb-3 border-b-2 border-blue-500 text-blue-600 font-medium whitespace-nowrap min-h-[44px] flex items-end">
            Today
          </button>
          <button className="pb-3 text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap min-h-[44px] flex items-end">
            Next 14 Days
          </button>
        </div>

        {/* Today's Visits */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Today's Visits</h2>
          <div className="space-y-4 sm:space-y-6">
            {visits.map((visit) => (
              <div key={visit.id} className="bg-white rounded-2xl shadow-sm">
                {/* Card content with proper responsive grid */}
                <div className="p-4 sm:p-6">
                  {/* Top section: Patient name, status, and action button */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                      {/* Patient Name and Status - Responsive layout */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 truncate pr-2" title={visit.patientName}>
                          {visit.patientName}
                        </h3>
                        <div className="flex-shrink-0">
                          {visit.status === 'completed' ? (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium min-h-[32px]">
                              <CheckCircle className="w-4 h-4 flex-shrink-0" />
                              <span className="whitespace-nowrap">Completed</span>
                            </div>
                          ) : visit.status === 'in-progress' ? (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium min-h-[32px]">
                              <span className="whitespace-nowrap">In Progress</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium min-h-[32px]">
                              <span className="whitespace-nowrap">Not Started</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visit Details - Improved icon alignment */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{visit.visitTime}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0 sm:col-span-2 lg:col-span-1">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate" title={visit.address}>{visit.address}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <Building className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{visit.insurance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button - Responsive positioning */}
                    <div className="flex-shrink-0 lg:ml-6">
                      {visit.status === 'completed' ? (
                        <button
                          onClick={() => handleViewSummary(visit.id)}
                          className="w-full sm:w-auto px-4 py-2 border border-[#5538A6] text-[#5538A6] bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors min-h-[44px] flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Summary</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLogOutcomes(visit.id)}
                          className="w-full sm:w-auto px-4 py-2 bg-[#5538A6] hover:bg-[#4A2F95] text-white rounded-lg font-medium transition-colors min-h-[44px] flex items-center justify-center"
                        >
                          Log Outcomes
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom section: Visit type, procedures, and HRA */}
                  <div className="space-y-4">
                    {/* Visit Type */}
                    <div>
                      <div className="inline-flex items-center px-3 py-1.5 border border-purple-600 text-purple-600 bg-white rounded-full text-sm font-medium min-h-[32px]">
                        {visit.visitType}
                      </div>
                    </div>

                    {/* Completed Procedures - Improved wrapping */}
                    <div>
                      <h4 className="text-sm text-gray-500 mb-3 font-medium">Visit Procedures:</h4>
                      <div className="flex flex-wrap gap-2">
                        {visit.completedProcedures.map((procedure, index) => (
                          <div 
                            key={index} 
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium min-h-[32px] transition-colors ${
                              procedure.status === 'completed' 
                                ? 'bg-teal-100 text-teal-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">{procedure.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Health Risk Assessment - Consistent styling */}
                    <div>
                      <h4 className="text-sm text-gray-500 mb-3 font-medium">Health Risk Assessment:</h4>
                      <div className="inline-flex">
                        {visit.hraStatus === 'completed' ? (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium min-h-[32px]">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">Completed</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium min-h-[32px]">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="whitespace-nowrap">In Progress</span>
                          </div>
                        )}
                      </div>
                    </div>
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
