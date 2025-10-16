interface OutcomeCardProps {
  title: string
  outcome?: 'completed' | 'not-completed' | undefined
  onCompletedClick?: () => void
  onNotCompletedClick?: () => void
}

export function OutcomeCard({ 
  title, 
  outcome, 
  onCompletedClick, 
  onNotCompletedClick 
}: OutcomeCardProps) {
  return (
    <div className="flex w-full max-w-md flex-col justify-center items-center gap-5 flex-shrink-0 rounded-2xl bg-white shadow-lg">
      <div className="flex p-6 flex-col items-center gap-4 w-full">
        <div className="flex flex-col items-start gap-4 w-full">
          <div className="flex justify-center items-center gap-4 w-full">
            <div className="flex flex-col items-start gap-3 flex-1">
              <div className="flex items-start gap-3">
                <h3 
                  className="text-gray-900 font-medium text-base leading-6"
                  style={{ 
                    color: '#1B1B1B', 
                    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    lineHeight: '24px', 
                    letterSpacing: '0.15px' 
                  }}
                >
                  {title}
                </h3>
              </div>
              <div className="flex items-start gap-6">
                <div className="flex items-center gap-1">
                  <span 
                    className="text-gray-500 font-medium text-sm leading-5"
                    style={{ 
                      color: '#939090', 
                      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      lineHeight: '20px', 
                      letterSpacing: '0.25px' 
                    }}
                  >
                    Outcome:
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-6 w-full">
            <button
              onClick={onCompletedClick}
              className={`flex justify-center items-center rounded-full border transition-colors px-6 py-2 ${
                outcome === 'completed' 
                  ? 'bg-[#5538A6] text-white border-[#5538A6]' 
                  : 'bg-white text-gray-900 border-gray-400 hover:bg-gray-50'
              }`}
              style={{ 
                width: '154px', 
                height: '44px',
                fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
                fontSize: '16px', 
                fontWeight: '500', 
                lineHeight: '24px', 
                letterSpacing: '0.15px' 
              }}
            >
              Completed
            </button>
            
            <button
              onClick={onNotCompletedClick}
              className={`flex justify-center items-center rounded-full border transition-colors px-6 py-2 ${
                outcome === 'not-completed' 
                  ? 'bg-[#5538A6] text-white border-[#5538A6]' 
                  : 'bg-white text-gray-900 border-gray-400 hover:bg-gray-50'
              }`}
              style={{ 
                width: '154px', 
                height: '44px',
                fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
                fontSize: '16px', 
                fontWeight: '500', 
                lineHeight: '24px', 
                letterSpacing: '0.15px' 
              }}
            >
              Not Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
