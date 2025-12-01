import {Check} from 'lucide-react'


interface VisitProcedure {
  name: string
  completed?: boolean
}

interface ConsentForm {
  name: string
  completed?: boolean
}

interface Visit {
  id: string
  patientName: string
  time: string
  address: string
  phone?: string
  insurance: string
  status: 'not-started' | 'in-progress' | 'completed' | 'ready-to-save'
  visitType: 'in-home' | 'telehealth'
  procedures: VisitProcedure[]
  healthRiskAssessment: 'not-started' | 'in-progress' | 'completed'
  consentForms: ConsentForm[]
  date?: string
}


export function StatusBadge({ status, visitState }: { status: Visit['status'], visitState?: any }) {
  // Determine the actual status to show
  let displayStatus = status // Default to original status

  // Only override if visitState has a status
  if (visitState && visitState.status) {
    displayStatus = visitState.status
  }

  const getStatusConfig = () => {
    // Check for completed status first
    if (displayStatus === 'completed') {
      return {
        style: {
          maxWidth: '100%',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1.5',
          cursor: 'unset',
          verticalAlign: 'middle',
          boxSizing: 'border-box',
          height: '26px',
          fontWeight: '500',
          fontSize: '0.75rem',
          backgroundColor: 'rgb(25, 154, 146)',
          color: 'rgb(255, 255, 255)',
          whiteSpace: 'nowrap',
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          outline: '0px',
          textDecoration: 'none',
          border: '0px',
          padding: '0px 8px',
          borderRadius: '999px'
        },
        text: 'Completed',
        showIcon: true
      }
    }

    // Check for ready-to-save status
    if (displayStatus === 'ready-to-save') {
      return {
        style: {
          maxWidth: '100%',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1.5',
          cursor: 'unset',
          verticalAlign: 'middle',
          boxSizing: 'border-box',
          height: '24px',
          fontSize: '0.75rem',
          backgroundColor: 'rgb(35, 155, 207)',
          color: 'rgb(255, 255, 255)',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          outline: '0px',
          textDecoration: 'none',
          border: '0px',
          padding: '0px 12px',
          borderRadius: '999px'
        },
        text: 'Ready to Save',
        showIcon: false
      }
    }

    // Check for in-progress status
    if (displayStatus === 'in-progress') {
      return {
        style: {
          maxWidth: '100%',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1.5',
          cursor: 'unset',
          verticalAlign: 'middle',
          boxSizing: 'border-box',
          height: '24px',
          fontSize: '0.75rem',
          backgroundColor: 'rgb(228, 118, 0)',
          color: 'rgb(255, 255, 255)',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          outline: '0px',
          textDecoration: 'none',
          border: '0px',
          padding: '0px 18px',
          borderRadius: '999px'
        },
        text: 'In Progress',
        showIcon: false
      }
    }

    // Default to not-started
    return {
      style: {
        maxWidth: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1.5',
        color: 'rgb(27, 27, 27)',
        backgroundColor: 'rgba(35, 155, 207, 0.08)',
        cursor: 'unset',
        verticalAlign: 'middle',
        boxSizing: 'border-box',
        fontSize: '0.75rem',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        outline: '0px',
        textDecoration: 'none',
        border: '0px',
        padding: '0px 16px',
        borderRadius: '999px',
        height: '24px'
      },
      text: 'Not Started',
      showIcon: false
    }
  }

  const config = getStatusConfig()

  return (
    <div
      className="inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
      style={config.style as React.CSSProperties}
    >
      {config.showIcon && (
        <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <Check className="w-2 h-2" style={{ color: 'rgb(25, 154, 146)' }} />
        </div>
      )}
      <span className="text-xs">{config.text}</span>
    </div>
  )
}

export function VisitTypeBadge({ visitType }: { visitType: Visit['visitType'] }) {
  if (visitType === 'telehealth') {
    return null // Don't show separate visit type badge for telehealth since it's shown after time
  }
  return (
    <div
      className="bg-white px-4 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border"
      style={{ color: '#5538A6', borderColor: '#5538A6' }}
    >
      In-Home Visit
    </div>
  )
}