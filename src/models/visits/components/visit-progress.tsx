interface VisitProgressProps {
  completed: number
  total: number
  progressPercent: number
}

export function VisitProgress({ completed, total, progressPercent }: VisitProgressProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">Visit Progress</h3>
        <p className="text-sm text-gray-500">Outcomes Captured</p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-purple-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <span className="text-base font-semibold text-gray-900">
          {completed}/{total}
        </span>
      </div>
    </div>
  )
}
