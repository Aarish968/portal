import { ChevronLeft } from 'lucide-react'

interface VisitDetailsHeaderProps {
  address?: string
  status?: 'not-started' | 'in-progress' | 'completed'
  onBackClick?: () => void
}

export function VisitDetailsHeader({ 
  address = '1234 Main Street, Dayton, OH', 
  status = 'not-started',
  onBackClick 
}: VisitDetailsHeaderProps) {
  const getStatusLabel = () => {
    switch (status) {
      case 'not-started':
        return 'Not Started'
      case 'in-progress':
        return 'In Progress'
      case 'completed':
        return 'Completed'
      default:
        return 'Not Started'
    }
  }

  const getStatusStyles = () => {
    switch (status) {
      case 'in-progress':
        return {
          border: '1px solid #f97316',
          background: '#fed7aa',
          color: '#c2410c'
        }
      case 'completed':
        return {
          border: '1px solid #10b981',
          background: '#d1fae5',
          color: '#047857'
        }
      default:
        return {
          border: '1px solid #939090',
          background: '#FFF',
          color: '#1B1B1B'
        }
    }
  }

  const statusStyles = getStatusStyles()

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
      <div className="flex px-8 py-6 justify-between items-center w-full bg-white shadow-lg">
        <div className="flex items-center gap-5">
          {/* Back Button */}
          <button 
            onClick={onBackClick}
            className="flex justify-center items-center w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-500" />
          </button>
          
          <div className="flex flex-col items-start gap-5">
            <div className="flex flex-col items-start gap-2.5">
              <div className="flex flex-col items-start">
                <div className="flex justify-center items-center gap-2">
                  <div className="flex justify-center items-center gap-2.5">
                    <h1 
                      className="text-gray-900 font-normal text-3xl leading-9"
                      style={{ 
                        color: '#1B1B1B', 
                        fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
                        fontSize: '28px', 
                        fontWeight: '400', 
                        lineHeight: '36px', 
                        letterSpacing: '0' 
                      }}
                    >
                      Visit Details
                    </h1>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span 
                    className="text-gray-500 font-normal text-base leading-6"
                    style={{ 
                      color: '#939090', 
                      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
                      fontSize: '16px', 
                      fontWeight: '400', 
                      lineHeight: '24px', 
                      letterSpacing: '0.15px' 
                    }}
                  >
                    {address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex px-1 flex-col items-start gap-2.5">
          <div 
            className="flex min-w-4 px-1.5 py-1 justify-center items-center rounded-full border"
            style={statusStyles}
          >
            <span 
              className="text-center font-medium text-xs leading-4"
              style={{ 
                color: statusStyles.color,
                fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', 
                fontSize: '12px', 
                fontWeight: '500', 
                lineHeight: '16px', 
                letterSpacing: '0.5px' 
              }}
            >
              {getStatusLabel()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
