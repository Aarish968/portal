import { MapPin, Clock } from 'lucide-react'
import { VisitProgress } from './visit-progress'
import { EQUIPMENT_NEEDED } from '../constants'

interface PatientInfoCardProps {
  patientName: string
  visitId: string
  address: string
  time: string
  progressData: {
    completedCount: number
    totalOutcomesSet: number
    progressPercent: number
  }
  totalOutcomes: number
}

export function PatientInfoCard({
  patientName,
  visitId,
  address,
  time,
  progressData,
  totalOutcomes
}: PatientInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Patient Info */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">{patientName}</h2>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-500">ID: {visitId}</p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="text-gray-900">{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-gray-900">{time}</span>
            </div>
          </div>
        </div>

        {/* Visit Progress */}
        <div>
          <VisitProgress
            completed={progressData.totalOutcomesSet}
            total={totalOutcomes}
            progressPercent={progressData.progressPercent}
          />
          
          <div className="mt-6">
            <h4 className="text-base font-semibold mb-3 text-gray-900">Equipment Needed</h4>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_NEEDED.map((equipment, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs text-gray-900"
                >
                  {equipment}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* HRA Assessment - This will be handled by parent component */}
        <div>
          {/* HRA content will be passed as children or handled separately */}
        </div>
      </div>
    </div>
  )
}