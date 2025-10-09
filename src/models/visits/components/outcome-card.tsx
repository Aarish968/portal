import React from 'react'

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
    <div 
      className=":uno: flex w-418px min-w-280px max-w-2000px flex-col justify-center items-center gap-20px flex-shrink-0 rounded-16px bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.30),0_1px_3px_1px_rgba(0,0,0,0.15)]"
      style={{ display: 'flex', width: '418px', minWidth: '280px', maxWidth: '2000px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px', flexShrink: '0', borderRadius: '16px', background: '#FFF', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 1px 3px 1px rgba(0, 0, 0, 0.15)' }}
    >
      <div 
        className=":uno: flex p-24px flex-col items-center gap-16px self-stretch"
        style={{ display: 'flex', padding: '24px', flexDirection: 'column', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}
      >
        <div 
          className=":uno: flex flex-col items-start gap-16px self-stretch"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', alignSelf: 'stretch' }}
        >
          <div 
            className=":uno: flex justify-center items-center gap-16px self-stretch"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', alignSelf: 'stretch' }}
          >
            <div 
              className=":uno: flex flex-col items-start gap-12px flex-1"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '12px', flex: '1 0 0' }}
            >
              <div 
                className=":uno: flex items-start gap-12px"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
              >
                <h3 
                  className=":uno: color-#1B1B1B font-family-Roboto font-size-16px font-weight-500 line-height-24px letter-spacing-0.15px"
                  style={{ color: '#1B1B1B', fontFamily: 'Roboto', fontSize: '16px', fontWeight: '500', lineHeight: '24px', letterSpacing: '0.15px' }}
                >
                  {title}
                </h3>
              </div>
              <div 
                className=":uno: flex items-start gap-24px"
                style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}
              >
                <div 
                  className=":uno: flex items-center gap-4px"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <span 
                    className=":uno: color-#939090 font-family-Roboto font-size-14px font-weight-500 line-height-20px letter-spacing-0.25px"
                    style={{ color: '#939090', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '500', lineHeight: '20px', letterSpacing: '0.25px' }}
                  >
                    Outcome:
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            className=":uno: flex items-start gap-24px self-stretch"
            style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', alignSelf: 'stretch' }}
          >
            <button
              onClick={onCompletedClick}
              className=":uno: flex w-154px h-44px justify-center items-center rounded-1000px border-1px border-#939090 bg-white hover:bg-gray-50 transition-colors"
              style={{ display: 'flex', width: '154px', height: '44px', justifyContent: 'center', alignItems: 'center', borderRadius: '1000px', border: '1px solid #939090', background: '#FFF' }}
            >
              <div 
                className=":uno: flex justify-center items-center gap-8px"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <span 
                  className=":uno: color-#1B1B1B font-family-Roboto font-size-16px font-weight-500 line-height-24px letter-spacing-0.15px"
                  style={{ color: '#1B1B1B', fontFamily: 'Roboto', fontSize: '16px', fontWeight: '500', lineHeight: '24px', letterSpacing: '0.15px' }}
                >
                  Completed
                </span>
              </div>
            </button>
            
            <button
              onClick={onNotCompletedClick}
              className=":uno: flex w-154px h-44px justify-center items-center rounded-1000px border-1px border-#939090 bg-white hover:bg-gray-50 transition-colors"
              style={{ display: 'flex', width: '154px', height: '44px', justifyContent: 'center', alignItems: 'center', borderRadius: '1000px', border: '1px solid #939090', background: '#FFF' }}
            >
              <div 
                className=":uno: flex justify-center items-center gap-8px"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <span 
                  className=":uno: color-#1B1B1B font-family-Roboto font-size-16px font-weight-500 line-height-24px letter-spacing-0.15px"
                  style={{ color: '#1B1B1B', fontFamily: 'Roboto', fontSize: '16px', fontWeight: '500', lineHeight: '24px', letterSpacing: '0.15px' }}
                >
                  Not Completed
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
