import React from 'react'
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

  return (
    <div 
      className=":uno: flex flex-col justify-center items-center gap-20px self-stretch"
      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', alignSelf: 'stretch' }}
    >
      <div 
        className=":uno: flex p-24px_32px justify-between items-center self-stretch rounded-0 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_1px_3px_1px_rgba(0,0,0,0.15)]"
        style={{ display: 'flex', padding: '24px 32px', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch', borderRadius: '0 0 0 0', background: '#FFF', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 1px 3px 1px rgba(0, 0, 0, 0.15)' }}
      >
        <div 
          className=":uno: flex items-center gap-20px"
          style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
        >
          {/* Back Button */}
          <button 
            onClick={onBackClick}
            className=":uno: flex justify-center items-center"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <div 
              className=":uno: flex w-56px flex-col justify-center items-center rounded-100px"
              style={{ display: 'flex', width: '56px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '100px' }}
            >
              <div 
                className=":uno: flex h-56px justify-center items-center self-stretch bg-#EFEFEF hover:bg-#DEDEDE transition-colors"
                style={{ display: 'flex', height: '56px', justifyContent: 'center', alignItems: 'center', alignSelf: 'stretch', background: '#EFEFEF' }}
              >
                <ChevronLeft 
                  className=":uno: w-24px h-24px"
                  style={{ width: '24px', height: '24px' }}
                  color="#939090"
                />
              </div>
            </div>
          </button>
          
          <div 
            className=":uno: flex flex-col items-start gap-20px"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}
          >
            <div 
              className=":uno: flex flex-col items-start gap-10px"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}
            >
              <div 
                className=":uno: flex flex-col items-start"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <div 
                  className=":uno: flex justify-center items-center gap-8px"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                >
                  <div 
                    className=":uno: flex justify-center items-center gap-10px"
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                  >
                    <h1 
                      className=":uno: color-#1B1B1B font-family-Roboto font-size-28px font-weight-400 line-height-36px letter-spacing-0"
                      style={{ color: '#1B1B1B', fontFamily: 'Roboto', fontSize: '28px', fontWeight: '400', lineHeight: '36px', letterSpacing: '0' }}
                    >
                      Visit Details
                    </h1>
                  </div>
                </div>
                <div 
                  className=":uno: flex items-start gap-10px"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                >
                  <span 
                    className=":uno: color-#939090 font-family-Roboto font-size-16px font-weight-400 line-height-24px letter-spacing-0.15px"
                    style={{ color: '#939090', fontFamily: 'Roboto', fontSize: '16px', fontWeight: '400', lineHeight: '24px', letterSpacing: '0.15px' }}
                  >
                    {address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className=":uno: flex p-0_4px flex-col items-start gap-10px"
          style={{ display: 'flex', padding: '0 4px', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}
        >
          <div 
            className={`:uno: flex min-w-16px p-4px_6px justify-center items-center rounded-100px border-1px ${
              status === 'in-progress' 
                ? 'border-orange-500 bg-orange-100' 
                : status === 'completed'
                ? 'border-green-500 bg-green-100'
                : 'border-#939090 bg-white'
            }`}
            style={{ 
              display: 'flex', 
              minWidth: '16px', 
              padding: '4px 6px', 
              justifyContent: 'center', 
              alignItems: 'center', 
              borderRadius: '100px',
              border: status === 'in-progress' ? '1px solid #f97316' : status === 'completed' ? '1px solid #10b981' : '1px solid #939090',
              background: status === 'in-progress' ? '#fed7aa' : status === 'completed' ? '#d1fae5' : '#FFF'
            }}
          >
            <span 
              className={`:uno: text-center font-family-Roboto font-size-12px font-weight-500 line-height-16px letter-spacing-0.5px ${
                status === 'in-progress' 
                  ? 'color-orange-700' 
                  : status === 'completed'
                  ? 'color-green-700'
                  : 'color-#1B1B1B'
              }`}
              style={{ 
                color: status === 'in-progress' ? '#c2410c' : status === 'completed' ? '#047857' : '#1B1B1B',
                textAlign: 'center', 
                fontFamily: 'Roboto', 
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
