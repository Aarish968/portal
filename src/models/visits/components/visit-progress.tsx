import React from 'react'

interface VisitProgressProps {
  completed: number
  total: number
}

export function VisitProgress({ completed, total }: VisitProgressProps) {
  const progressPercentage = (completed / total) * 100

  return (
    <div 
      className=":uno: flex flex-col items-center gap-8px self-stretch"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', alignSelf: 'stretch' }}
    >
      <h3 
        className=":uno: self-stretch color-black font-family-Roboto font-size-16px font-weight-500 line-height-24px letter-spacing-0.15px"
        style={{ alignSelf: 'stretch', color: '#000', fontFamily: 'Roboto', fontSize: '16px', fontWeight: '500', lineHeight: '24px', letterSpacing: '0.15px' }}
      >
        Visit Progress
      </h3>
      <span 
        className=":uno: self-stretch color-#939090 font-family-Roboto font-size-14px font-weight-500 line-height-20px letter-spacing-0.1px"
        style={{ alignSelf: 'stretch', color: '#939090', fontFamily: 'Roboto', fontSize: '14px', fontWeight: '500', lineHeight: '20px', letterSpacing: '0.1px' }}
      >
        Captured Outcomes {completed}/{total}
      </span>
      
      {/* Progress Indicator */}
      <div 
        className=":uno: flex items-start gap-6px self-stretch"
        style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', alignSelf: 'stretch' }}
      >
        <div 
          className=":uno: h-12px flex-1 relative"
          style={{ height: '12px', flex: '1 0 0', position: 'relative' }}
        >
          <div 
            className=":uno: flex w-342px h-12px p-2px_0 justify-center items-center flex-shrink-0 absolute left-0 top-0"
            style={{ display: 'flex', width: '342px', height: '12px', padding: '2px 0', justifyContent: 'center', alignItems: 'center', flexShrink: '0', position: 'absolute', left: '0px', top: '0px' }}
          >
            <div 
              className=":uno: w-342px h-8px flex-shrink-0 rounded-4px bg-#EFEFEF absolute left-0 top-2px"
              style={{ width: '342px', height: '8px', flexShrink: '0', borderRadius: '4px', background: '#EFEFEF', position: 'absolute', left: '0px', top: '2px' }}
            ></div>
            {/* Progress fill - only show if there's progress */}
            {progressPercentage > 0 && (
              <div 
                className=":uno: h-8px flex-shrink-0 rounded-4px bg-#5538A6 absolute left-0 top-2px"
                style={{ 
                  height: '8px', 
                  flexShrink: '0', 
                  borderRadius: '4px', 
                  background: '#5538A6', 
                  position: 'absolute', 
                  left: '0px', 
                  top: '2px',
                  width: `${Math.min(progressPercentage, 100)}%`
                }}
              ></div>
            )}
          </div>
          <div 
            className=":uno: w-8px h-8px flex-shrink-0 absolute left-334px top-2px"
            style={{ width: '8px', height: '8px', flexShrink: '0', position: 'absolute', left: '334px', top: '2px' }}
          >
            <div 
              className=":uno: w-4px h-4px flex-shrink-0 rounded-3px bg-#5538A6 absolute left-2px top-2px"
              style={{ width: '4px', height: '4px', flexShrink: '0', borderRadius: '3px', background: '#5538A6', position: 'absolute', left: '2px', top: '2px' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
