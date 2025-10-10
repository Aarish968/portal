import React from 'react'
import { ArrowLeft, Clock, MapPin, Building, CheckCircle, FileText, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const completedVisits = [
  {
    id: 'visit-1',
    patientName: 'Maria Rodriguez',
    visitTime: '8:00 AM',
    address: '567 Oak Avenue, Dayton, OH',
    insurance: 'Aetna',
    visitType: 'In-Home Visit',
    status: 'completed',
    completedProcedures: [
      { name: 'HbA1c Test', status: 'completed' },
      { name: 'Retinal Screening', status: 'completed' },
      { name: 'Bone Density Scan', status: 'completed' }
    ],
    hraStatus: 'in-progress'
  }
]

export default function VisitOutcomesView() {
  const navigate = useNavigate()
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

  const handleViewSummary = (visitId: string) => {
    console.log('Viewing summary for visit:', visitId)
    // Navigate to detailed visit summary
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/visits')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
            {completedVisits.map((visit) => (
              <div key={visit.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    {/* Patient Name and Status */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{visit.patientName}</h3>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
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
                      <h4 className="text-sm text-gray-500 mb-3">Completed Procedures:</h4>
                      <div className="flex flex-wrap gap-2">
                        {visit.completedProcedures.map((procedure, index) => (
                          <div key={index} className="flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            <span>{procedure.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Health Risk Assessment */}
                    <div>
                      <h4 className="text-sm text-gray-500 mb-2">Health Risk Assessment:</h4>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium w-fit">
                        <FileText className="w-4 h-4" />
                        <span>In Progress</span>
                      </div>
                    </div>
                  </div>

                  {/* View Summary Button */}
                  <div className="ml-6">
                    <button
                      onClick={() => handleViewSummary(visit.id)}
                      className="px-4 py-2 border border-[#5538A6] text-[#5538A6] bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 inline mr-2" />
                      View Summary
                    </button>
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
