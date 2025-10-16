interface VisitProgressProps {
  completed: number
  total: number
}

export function VisitProgress({ completed, total }: VisitProgressProps) {
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <h3 
        className="w-full text-black font-medium text-base leading-6"
        style={{ 
          color: '#000', 
          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
          fontSize: '16px', 
          fontWeight: '500', 
          lineHeight: '24px', 
          letterSpacing: '0.15px' 
        }}
      >
        Visit Progress
      </h3>
      <span 
        className="w-full text-gray-500 font-medium text-sm leading-5"
        style={{ 
          color: '#939090', 
          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
          fontSize: '14px', 
          fontWeight: '500', 
          lineHeight: '20px', 
          letterSpacing: '0.1px' 
        }}
      >
        Captured Outcomes {completed}/{total}
      </span>
      
      {/* Progress Bar */}
      <div className="flex items-center gap-1.5 w-full">
        <div className="h-3 flex-1 relative">
          {/* Background bar */}
          <div 
            className="w-full h-2 rounded bg-gray-200 absolute top-0.5"
            style={{ background: '#EFEFEF' }}
          />
          {/* Progress fill */}
          {progressPercentage > 0 && (
            <div 
              className="h-2 rounded absolute top-0.5 transition-all duration-300"
              style={{ 
                background: '#5538A6',
                width: `${Math.min(progressPercentage, 100)}%`
              }}
            />
          )}
          {/* End indicator */}
          <div 
            className="w-2 h-2 absolute right-0 top-0.5"
            style={{ 
              width: '8px', 
              height: '8px'
            }}
          >
            <div 
              className="w-1 h-1 rounded-full absolute top-0.5 left-0.5"
              style={{ 
                width: '4px', 
                height: '4px', 
                borderRadius: '3px', 
                background: '#5538A6'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
