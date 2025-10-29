import { useEffect, useState, useRef, useCallback } from 'react'
import { Clock, MapPin, Building, Check, ChevronDown, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/data/routing/routes'

// Simple Card components (replacing shadcn/ui for demo)
type SimpleProps = { children: React.ReactNode, className?: string, onClick?: () => void, style?: React.CSSProperties }
const Card = ({ children, className = '', onClick, style }: SimpleProps) => (
  <div className={`bg-white rounded-lg ${className}`} onClick={onClick} style={style}>{children}</div>
)

const CardContent = ({ children, className = '' }: SimpleProps) => (
  <div className={className}>{children}</div>
)

type ButtonProps = { children: React.ReactNode, className?: string, style?: React.CSSProperties, onClick?: () => void, variant?: 'default' | 'outline' }
const Button = ({ children, className = '', style, onClick, variant = 'default' }: ButtonProps) => {
  const baseClass = 'rounded-full px-6 py-2 text-sm font-medium transition-colors'
  const variantClass =
    variant === 'outline'
      ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      : ''
  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ')

// Video Camera Icon Component (Icons.Outlined.Videocam style)
const VideocamIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z" />
  </svg>
)

interface VisitProcedure {
  name: string
  completed?: boolean
}

interface Visit {
  id: string
  patientName: string
  time: string
  address: string
  insurance: string
  status: 'not-started' | 'in-progress' | 'completed'
  visitType: 'in-home' | 'telehealth'
  procedures: VisitProcedure[]
  healthRiskAssessment: 'not-started' | 'in-progress' | 'completed'
  date?: string
}

const equipmentDataToday = [
  { name: 'HbA1c Kit', visits: 3 },
  { name: 'Lipid Panel Kit', visits: 2 },
  { name: 'Microalbumin Kit', visits: 1 },
  { name: 'FIT/FOBT Kit', visits: 1 },
  { name: 'Retinal Camera', visits: 1 },
  { name: 'Bone Density Kit', visits: 1 },
  { name: 'Portable ECG/EKG', visits: 1 },
  { name: 'Vaccine Kit', visits: 1 },
  { name: 'STI Kit', visits: 1 },
]

const equipmentData14Days = [
  { name: 'HbA1c Kit', visits: 11 },
  { name: 'Lipid Panel Kit', visits: 12 },
  { name: 'Microalbumin Kit', visits: 8 },
  { name: 'FIT/FOBT Kit', visits: 9 },
  { name: 'Pap/HPV Kit', visits: 5 },
  { name: 'Retinal Camera', visits: 13 },
  { name: 'Spirometry Kit', visits: 10 },
  { name: 'Bone Density Kit', visits: 12 },
  { name: 'Portable ECG/EKG', visits: 9 },
  { name: 'Vaccine Kit', visits: 9 },
  { name: 'Portable Ultrasound', visits: 8 },
  { name: 'STI Kit', visits: 11 },
  { name: 'Hep C Kit', visits: 9 },
  { name: 'HIV Kit', visits: 12 },
]

const mockVisitsToday: Visit[] = [
  {
    id: '1',
    patientName: 'Jane Smith',
    time: '10:30AM',
    address: '1234 Main Street, Dayton, OH',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    procedures: [
      { name: 'A1C' },
      { name: 'Blood Pressure' },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '2',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    insurance: 'Aetna',
    status: 'in-progress',
    visitType: 'telehealth',
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'in-progress',
  },
  {
    id: '3',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    insurance: 'Aetna',
    status: 'in-progress',
    visitType: 'telehealth',
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '4',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    insurance: 'Aetna',
    status: 'in-progress',
    visitType: 'telehealth',
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'in-progress',
  },
]

const mockVisits14Days: Visit[] = [
  {
    id: '1',
    patientName: 'Emily Davis',
    time: '9:30AM',
    address: '',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'telehealth',
    date: 'Thursday, August 6, 2025',
    procedures: [
      { name: 'Ultrasound' },
      { name: 'FIT/FOBT Test' },
      { name: 'Microalbumin Test' },
      { name: 'Spirometry Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '2',
    patientName: 'Brandon Young',
    time: '1:00PM',
    address: '147 Willow Court, Englewo...',
    insurance: 'BCBS',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 6, 2025',
    procedures: [
      { name: 'EKG' },
      { name: 'Hepatitis C Test' },
      { name: 'HIV Test' },
      { name: 'FIT/FOBT Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '3',
    patientName: 'Sarah Johnson',
    time: '10:00AM',
    address: '789 Pine Street, Dayton, OH',
    insurance: 'Aetna',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 7, 2025',
    procedures: [
      { name: 'HbA1c Test' },
      { name: 'Blood Pressure' },
      { name: 'Retinal Screening' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '4',
    patientName: 'Michael Brown',
    time: '2:30PM',
    address: '321 Oak Avenue, Dayton, OH',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 7, 2025',
    procedures: [
      { name: 'Lipid Panel' },
      { name: 'Bone Density' },
      { name: 'Vaccine' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '5',
    patientName: 'Lisa Wilson',
    time: '11:00AM',
    address: '',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'telehealth',
    date: 'Thursday, August 8, 2025',
    procedures: [
      { name: 'Pap/HPV Test' },
      { name: 'STI Testing' },
      { name: 'HIV Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '6',
    patientName: 'David Miller',
    time: '3:00PM',
    address: '456 Elm Street, Dayton, OH',
    insurance: 'BCBS',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 8, 2025',
    procedures: [
      { name: 'Portable ECG' },
      { name: 'Hepatitis C Test' },
      { name: 'FIT/FOBT Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '7',
    patientName: 'Jennifer Garcia',
    time: '9:00AM',
    address: '654 Maple Drive, Dayton, OH',
    insurance: 'Aetna',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Friday, August 9, 2025',
    procedures: [
      { name: 'Microalbumin Test' },
      { name: 'Spirometry Test' },
      { name: 'Vaccine' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '8',
    patientName: 'Robert Taylor',
    time: '1:30PM',
    address: '987 Cedar Lane, Dayton, OH',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Friday, August 9, 2025',
    procedures: [
      { name: 'Retinal Camera' },
      { name: 'Bone Density' },
      { name: 'Portable Ultrasound' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '9',
    patientName: 'Maria Rodriguez',
    time: '10:30AM',
    address: '',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'telehealth',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'HbA1c Test' },
      { name: 'Lipid Panel' },
      { name: 'Blood Pressure' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '10',
    patientName: 'James Anderson',
    time: '2:00PM',
    address: '123 Birch Street, Dayton, OH',
    insurance: 'BCBS',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'EKG' },
      { name: 'HIV Test' },
      { name: 'Hepatitis C Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '11',
    patientName: 'Patricia White',
    time: '4:30PM',
    address: '789 Cedar Avenue, Dayton, OH',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'Blood Pressure' },
      { name: 'Vaccine' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '12',
    patientName: 'Thomas Clark',
    time: '6:00PM',
    address: '456 Pine Street, Dayton, OH',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'Lipid Panel' },
      { name: 'HbA1c Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '13',
    patientName: 'Piter Clark',
    time: '7:00PM',
    address: '456 Pine Street, Dayton, OH',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'Lipid Panel' },
      { name: 'HbA1c Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
]

function StatusBadge({ status, visitState }: { status: Visit['status'], visitState?: any }) {
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
          height: '24px',
          fontWeight: '500',
          fontSize: '0.75rem',
          backgroundColor: 'rgb(25, 154, 146)',
          color: 'rgb(255, 255, 255)',
          whiteSpace: 'nowrap',
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          outline: '0px',
          textDecoration: 'none',
          border: '0px',
          padding: '0px 12px',
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
      style={config.style}
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

function ProcedureBadge({ procedure }: { procedure: VisitProcedure }) {
  if (procedure.completed) {
    return (
      <div
        className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
        style={{
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
          fontWeight: '500',
          fontSize: '0.75rem',
          backgroundColor: 'rgb(25, 154, 146)',
          color: 'rgb(255, 255, 255)',
          whiteSpace: 'nowrap',
          transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          outline: '0px',
          textDecoration: 'none',
          borderWidth: '0px',
          borderStyle: 'initial',
          borderColor: 'initial',
          borderImage: 'initial',
          padding: '0px 8px',
          borderRadius: '999px'
        }}
      >
        <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <Check className="w-2 h-2" style={{ color: 'rgb(25, 154, 146)' }} />
        </div>
        <span className="text-xs">{procedure.name}</span>
      </div>
    )
  }
  return (
    <div className="border border-gray-300 rounded-full bg-white text-gray-700 px-2 sm:px-3 py-1 text-xs font-medium whitespace-nowrap">
      {procedure.name}
    </div>
  )
}

function VisitTypeBadge({ visitType }: { visitType: Visit['visitType'] }) {
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

function VisitCard({ visit }: { visit: Visit }) {
  const navigate = useNavigate()

  const handleVisitClick = () => {
    navigate(ROUTES.app.visitDetails.href.replace(':visitId', visit.id), { state: { visit } })
  }

  // Get visit state from session storage
  const visitState = (() => {
    try {
      const stored = sessionStorage.getItem(`visit-state-${visit.id}`)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })()

  const getActionButton = () => {
    // Get the actual visit status from session storage (same logic as StatusBadge)
    let displayStatus = visit.status // Default to original status
    if (visitState?.status) {
      displayStatus = visitState.status
    }

    // Button logic based on badge status
    if (displayStatus === 'completed') {
      // Completed badge → View Summary button (with special styling)
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none text-sm leading-7 min-w-16 font-medium transition-all duration-250 ease-out"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            color: 'rgb(85, 56, 166)',
            backgroundColor: 'transparent',
            minHeight: '44px',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '5px 15px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgb(85, 56, 166)',
            borderRadius: '12px',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          View Summary
        </button>
      )
    } else if (displayStatus === 'ready-to-save') {
      // Ready to Save badge → Save button
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '44px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '6px 16px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '18px'
          }}
        >
          Save
        </button>
      )
    } else {
      // Not Started / In Progress badge → Log Outcomes button
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            minHeight: '44px',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '6px 16px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px'
          }}
        >
          Log Outcomes
        </button>
      )
    }
  }

  const getHRABadge = () => {
    // Check session storage for HRA completion
    const hraCompleted = visitState?.outcomes?.['hra'] === 'completed'

    // Determine HRA status based on session storage and original status
    let hraStatus = visit.healthRiskAssessment

    if (hraCompleted) {
      // If HRA is completed in visit details but visit is not saved yet, show in-progress
      const visitCompleted = visitState?.status === 'completed'
      hraStatus = visitCompleted ? 'completed' : 'in-progress'
    }

    if (hraStatus === 'completed') {
      return (
        <div
          className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
          style={{
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
            fontWeight: '500',
            fontSize: '0.75rem',
            backgroundColor: 'rgb(25, 154, 146)',
            color: 'rgb(255, 255, 255)',
            whiteSpace: 'nowrap',
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            outline: '0px',
            textDecoration: 'none',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            padding: '0px 12px',
            borderRadius: '999px'
          }}
        >
          <div className="w-3 h-3 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Check className="w-2 h-2" style={{ color: 'rgb(25, 154, 146)' }} />
          </div>
          <span className="text-xs">Completed</span>
        </div>
      )
    } else if (hraStatus === 'in-progress') {
      return (
        <div
          className="inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap rounded-full"
          style={{
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
            fontWeight: '500',
            fontSize: '0.75rem',
            backgroundColor: 'rgb(228, 118, 0)',
            color: 'rgb(255, 255, 255)',
            whiteSpace: 'nowrap',
            transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            outline: '0px',
            textDecoration: 'none',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            padding: '0px 12px',
            borderRadius: '999px'
          }}
        >
          {/* Clipboard icon */}
          <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7,9V11H17V9H7M7,13V15H14V13H7Z" />
          </svg>
          <span className="text-xs">In Progress</span>
        </div>
      )
    } else {
      return (
        <div className="bg-red-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 whitespace-nowrap">
          <span className="text-xs">Not Started</span>
        </div>
      )
    }
  }

  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full" style={{ width: '100%', maxWidth: '100%' }}>
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col visit-card-content">
        <div className="space-y-4 sm:space-y-5">
          {/* Header Row */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
                <h3 className="text-base sm:text-lg font-medium truncate" style={{ color: '#1b1b1b' }}>
                  {visit.patientName}
                </h3>
                <div className="flex-shrink-0">
                  <StatusBadge status={visit.status} visitState={visitState} />
                </div>
              </div>
              <div className="w-full sm:w-auto sm:flex-shrink-0">{getActionButton()}</div>
            </div>
          </div>

          {/* Visit Details - Responsive Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm min-w-0 visit-details-mobile" style={{ color: '#939090' }}>
            {/* Time */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{visit.time}</span>
            </div>

            {/* Address - show for all visits */}
            {visit.address && (
              <div className="flex items-center gap-1 min-w-0 max-w-full sm:max-w-xs">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{visit.address}</span>
              </div>
            )}

            {/* Insurance */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Building className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{visit.insurance}</span>
            </div>
          </div>

          {/* Second Telehealth Button (below time for telehealth visits) */}
          {visit.visitType === 'telehealth' && (
            <div className="flex justify-start">
              <div
                className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border"
                style={{
                  color: '#239BCF',
                  borderColor: '#239BCF',
                }}
              >
                <VideocamIcon className="w-3 h-3" />
                <span>Telehealth</span>
              </div>
            </div>
          )}

          {/* Visit Type */}
          <VisitTypeBadge visitType={visit.visitType} />

          {/* First Separator Line */}
          <div className="border-t border-gray-200"></div>

          {/* Procedures */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
              Applied Procedures
            </h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 procedures-mobile">
              {visit.procedures.map((p, i) => {
                // Map procedure names to IDs used in visit details
                const procedureIdMap: Record<string, string> = {
                  'A1C': 'a1c',
                  'Blood Pressure': 'blood-pressure',
                  'Urine Sample': 'urine-sample'
                }

                const procedureId = procedureIdMap[p.name] || p.name.toLowerCase().replace(/\s+/g, '-')
                // Only show completed if actually completed in session storage
                const isCompleted = visitState?.outcomes?.[procedureId] === 'completed'

                return (
                  <div key={i} className="flex-shrink-0">
                    <ProcedureBadge procedure={{ ...p, completed: isCompleted }} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Second Separator Line */}
          <div className="border-t border-gray-200"></div>

          {/* Health Risk Assessment */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
              Health Risk Assessment
            </h4>
            {getHRABadge()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function VisitsDashboard() {
  const [activeTab, setActiveTab] = useState('today')
  const [visitsToday, setVisitsToday] = useState<Visit[]>(mockVisitsToday)
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false)
  const [time, setTime] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const dateSectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const currentVisits = activeTab === 'today' ? visitsToday : mockVisits14Days
  const currentEquipment = activeTab === 'today' ? equipmentDataToday : equipmentData14Days
  const equipmentCount = currentEquipment.length
  const visitCount = currentVisits.length

  const groupedVisits = currentVisits.reduce((acc: Record<string, Visit[]>, v) => {
    const key = v.date || 'Today'
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {})

  // Load persisted state for all visits by id
  const refreshVisitStates = useCallback(() => {
    try {
      setVisitsToday(prev => prev.map(v => {
        const raw = sessionStorage.getItem(`visit-state-${v.id}`)
        if (!raw) return v
        const data = JSON.parse(raw)
        const isCompleted = data?.status === 'completed'
        return {
          ...v,
          status: isCompleted ? 'completed' : v.status,
          procedures: v.procedures.map(p => ({ ...p, completed: isCompleted ? true : p.completed })),
          healthRiskAssessment: isCompleted ? 'completed' : v.healthRiskAssessment
        }
      }))
    } catch { }
  }, [])

  useEffect(() => {
    refreshVisitStates()
  }, [refreshVisitStates])

  // Refresh data when window gains focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      refreshVisitStates()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshVisitStates])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: any = { hour: '2-digit', minute: '2-digit', hour12: true }
      setTime(now.toLocaleTimeString('en-US', options))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  // Refresh dashboard for real-time updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setRefreshTrigger(Date.now())
    }, 500) // Refresh every 0.5 seconds

    return () => clearInterval(refreshInterval)
  }, [])

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      setRefreshTrigger(Date.now())
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Scroll detection for making date cards sticky
  const handleScroll = useCallback(() => {
    if (activeTab !== '14days') return

    try {
      const headerHeight = 135
      const sidebarWidth = 200

      Object.entries(groupedVisits).forEach(([date, visits]) => {
        const dateElement = dateRefs.current[date]
        const dateSectionElement = dateSectionRefs.current[date]

        if (!dateElement || !dateSectionElement) return

        const wrapper = dateElement.parentElement
        const whiteContainer = dateSectionElement.querySelector('.bg-white.rounded-lg')

        if (!whiteContainer) return

        // Store original dimensions once
        if (!dateElement.dataset.originalWidth) {
          const rect = dateElement.getBoundingClientRect()
          dateElement.dataset.originalWidth = rect.width.toString()
          dateElement.dataset.originalHeight = rect.height.toString()
        }
        const originalWidth = parseFloat(dateElement.dataset.originalWidth || '0')
        const originalHeight = parseFloat(dateElement.dataset.originalHeight || '0')

        const sectionRect = dateSectionElement.getBoundingClientRect()
        const containerRect = whiteContainer.getBoundingClientRect()

        // Calculate positions more precisely
        const sectionTop = sectionRect.top
        const sectionBottom = sectionRect.bottom
        const containerTop = containerRect.top
        const containerBottom = containerRect.bottom

        // Determine the state based on section position
        const stickyThreshold = headerHeight
        const dateCardHeight = originalHeight

        // Check if section is in view and should have sticky behavior
        if (sectionTop <= stickyThreshold && sectionBottom > stickyThreshold) {
          // Section is active - date card should be sticky

          // Calculate the ideal position for the date card
          const idealStickyPosition = stickyThreshold
          const containerBottomPosition = containerBottom - dateCardHeight
          
          // Determine the actual position based on available space
          if (containerBottom >= stickyThreshold + dateCardHeight) {
            // Enough space - stick to top (normal sticky behavior)
            dateElement.style.position = 'fixed'
            dateElement.style.top = `${idealStickyPosition}px`
            dateElement.style.left = `${sidebarWidth + 20}px`
            dateElement.style.width = `${originalWidth}px`
            dateElement.style.height = `${originalHeight}px`
            dateElement.style.zIndex = '10'
            dateElement.style.opacity = '1'
            dateElement.style.visibility = 'visible'
            dateElement.style.backgroundColor = 'rgb(247, 252, 255)'
            dateElement.style.backdropFilter = 'blur(8px)'
            dateElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'

            // Maintain space in layout
            if (wrapper) {
              wrapper.style.height = `${originalHeight}px`
              wrapper.style.visibility = 'hidden'
            }
          } else if (containerBottom > stickyThreshold) {
            // Limited space - date card should stop at container bottom and move up with it
            // This creates the "stopping at bottom and moving up" behavior you want
            dateElement.style.position = 'fixed'
            dateElement.style.top = `${containerBottomPosition}px`
            dateElement.style.left = `${sidebarWidth + 20}px`
            dateElement.style.width = `${originalWidth}px`
            dateElement.style.height = `${originalHeight}px`
            dateElement.style.zIndex = '10'
            dateElement.style.opacity = '1'
            dateElement.style.visibility = 'visible'
            dateElement.style.backgroundColor = 'rgb(247, 252, 255)'
            dateElement.style.backdropFilter = 'blur(8px)'
            dateElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'

            // Maintain space in layout
            if (wrapper) {
              wrapper.style.height = `${originalHeight}px`
              wrapper.style.visibility = 'hidden'
            }
          } else {
            // Container has moved completely above the header - hide date card
            dateElement.style.opacity = '0'
            dateElement.style.visibility = 'hidden'
            
            // Reset wrapper
            if (wrapper) {
              wrapper.style.height = 'auto'
              wrapper.style.visibility = 'visible'
            }
          }
        } else {
          // Section is not active - show date card in normal position
          dateElement.style.position = 'relative'
          dateElement.style.top = 'auto'
          dateElement.style.left = 'auto'
          dateElement.style.width = 'auto'
          dateElement.style.height = 'auto'
          dateElement.style.zIndex = 'auto'
          dateElement.style.opacity = '1'
          dateElement.style.visibility = 'visible'
          dateElement.style.backgroundColor = 'rgb(247, 252, 255)'
          dateElement.style.backdropFilter = 'blur(8px)'
          dateElement.style.boxShadow = 'none'

          // Reset wrapper
          if (wrapper) {
            wrapper.style.height = 'auto'
            wrapper.style.visibility = 'visible'
          }
        }
      })
    } catch (error) {
      console.error('Scroll error:', error)
    }
  }, [activeTab, groupedVisits])

  useEffect(() => {
    let ticking = false

    const optimizedHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    if (activeTab === '14days') {
      // Initial call to set up positions
      handleScroll()

      window.addEventListener('scroll', optimizedHandleScroll, { passive: true })
      window.addEventListener('resize', optimizedHandleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', optimizedHandleScroll)
        window.removeEventListener('resize', optimizedHandleScroll)

        // Reset all date card styles when switching tabs
        Object.values(dateRefs.current).forEach(element => {
          if (element) {
            const wrapper = element.parentElement

            // Reset date element
            element.style.position = 'relative'
            element.style.top = 'auto'
            element.style.left = 'auto'
            element.style.width = 'auto'
            element.style.height = 'auto'
            element.style.zIndex = 'auto'
            element.style.opacity = '1'
            element.style.visibility = 'visible'
            element.style.backgroundColor = 'rgb(247, 252, 255)'
            element.style.backdropFilter = 'blur(8px)'
            element.style.boxShadow = 'none'

            // Reset wrapper
            if (wrapper) {
              wrapper.style.height = 'auto'
              wrapper.style.visibility = 'visible'
            }
          }
        })
      }
    } else {
      // Reset all date card styles when not on 14days tab
      Object.values(dateRefs.current).forEach(element => {
        if (element) {
          const wrapper = element.parentElement

          // Reset date element
          element.style.position = 'relative'
          element.style.top = 'auto'
          element.style.left = 'auto'
          element.style.width = 'auto'
          element.style.height = 'auto'
          element.style.zIndex = 'auto'
          element.style.opacity = '1'
          element.style.visibility = 'visible'
          element.style.backgroundColor = 'rgb(247, 252, 255)'
          element.style.backdropFilter = 'blur(8px)'
          element.style.boxShadow = 'none'

          // Reset wrapper
          if (wrapper) {
            wrapper.style.height = 'auto'
            wrapper.style.visibility = 'visible'
          }
        }
      })
    }
  }, [activeTab, handleScroll])



  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Custom styles for responsive zoom behavior and mobile fixes */}
      <style>{`
        /* Mobile-first responsive design */
        @media (max-width: 639px) {
          .mobile-header {
            left: 12.3rem !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
            margin-left: 0 !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .mobile-content {
            padding-top: 12rem !important;
            padding-left: 3rem !important;
            padding-right: 1rem !important;
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* Force single column layout on mobile */
          .visits-grid-14days {
            display: block !important;
            grid-template-columns: none !important;
            width: 100% !important;
          }
          
          .visits-grid-14days > div {
            width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
          }
          
          /* Mobile visit card styling */
          .visit-card-mobile {
            width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
          }
          
          /* Mobile visit details - stack vertically */
          .visit-details-mobile {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          
          /* Mobile procedure badges - wrap properly */
          .procedures-mobile {
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }
          
          /* Mobile header adjustments */
          .mobile-header-content {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }
          
          /* Mobile tabs */
          .mobile-tabs {
            width: 100% !important;
            justify-content: flex-start !important;
          }
        }
        
        /* Tablet responsive fixes */
        @media (min-width: 640px) and (max-width: 1023px) {
          .mobile-header {
            left: 12.3rem !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
          }
          
          .mobile-content {
            padding-top: 10rem !important;
            padding-left: 3rem !important;
            padding-right: 1.5rem !important;
            margin-left: 0 !important;
          }
          
          /* Tablet: single column for 14 days view */
          .visits-grid-14days {
            display: block !important;
            grid-template-columns: none !important;
            width: 100% !important;
          }
          
          .visits-grid-14days > div {
            width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
          }
        }
        
        /* Desktop: maintain current layout */
        @media (min-width: 1024px) {
          .visits-grid-14days {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
            width: 100% !important;
          }
          
          .visits-grid-14days > div {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100% !important;
          }
        }
        
        /* Force single column layout for Today's visits on all devices */
        .visits-grid-today {
          display: block !important;
          width: 100% !important;
        }
        
        .visits-grid-today > div {
          width: 100% !important;
          max-width: 100% !important;
          margin-bottom: 1rem !important;
          display: block !important;
        }
        
        /* Date card styling */
        .date-card {
          background-color: rgb(247, 252, 255) !important;
          border: 1px solid rgb(232, 244, 253) !important;
          color: #239BCF !important;
          margin-bottom: 1rem !important;
          backdrop-filter: blur(8px) !important;
          visibility: visible !important;
          opacity: 1 !important;
          transition: all 0.2s ease-in-out !important;
        }
        
        /* Date card wrapper */
        .date-card-wrapper {
          position: relative !important;
          width: 100% !important;
          min-height: fit-content !important;
        }
        
        /* Visit card content improvements */
        .visit-card-content {
          overflow: hidden !important;
          word-wrap: break-word !important;
        }
        
        /* Responsive text and spacing */
        @media (max-width: 639px) {
          .visit-card-content {
            padding: 1rem !important;
          }
          
          .visit-card-content h3 {
            font-size: 1rem !important;
            line-height: 1.25 !important;
          }
          
          .visit-card-content .text-sm {
            font-size: 0.875rem !important;
          }
          
          .visit-card-content .text-xs {
            font-size: 0.75rem !important;
          }
        }
        
        /* Equipment section mobile fixes */
        @media (max-width: 639px) {
          .equipment-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
          }
          
          .equipment-stats {
            width: 100% !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
      {/* Fixed Header - fully responsive */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm lg:left-48 xl:left-49 mobile-header">
        <div className="px-4 sm:px-6 py-4 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 mobile-header-content">
            <div className="mb-3 sm:mb-0">
              <h1 className="font-medium text-base sm:text-lg" style={{ color: '#1b1b1b', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
                Visit Outcomes
              </h1>
              <p className="mt-1 text-sm" style={{ color: '#939090' }}>
                Friday, October 10, 2025
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex flex-col items-end">
                <span className="text-gray-400 text-xs">Current Time</span>
                <span className="font-semibold text-black text-sm">{time}</span>
              </div>
              <button
                className="p-1.5 sm:p-2 rounded-full transition-colors duration-200 hover:bg-gray-200 active:bg-blue-100"
                style={{ backgroundColor: '#F5F5F5' }}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="relative flex gap-4 sm:gap-8 pb-3 mobile-tabs">
            <button
              onClick={() => setActiveTab('today')}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
              onMouseLeave={(e) => e.currentTarget.style.color = activeTab === 'today' ? '#239BCF' : '#1b1b1b'}
              className="relative font-medium transition-all duration-300 text-sm sm:text-base"
              style={{
                color: activeTab === 'today' ? '#239BCF' : '#1b1b1b'
              }}
            >
              {activeTab === 'today' && (
                <span
                  className="absolute inset-0 -z-10 rounded"
                  style={{
                    backgroundColor: 'rgba(35, 155, 207, 0.1)',
                    boxShadow: '0 0 15px rgba(35, 155, 207, 0.3)'
                  }}
                />
              )}
              Today
            </button>
            <button
              onClick={() => setActiveTab('14days')}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
              onMouseLeave={(e) => e.currentTarget.style.color = activeTab === '14days' ? '#239BCF' : '#1b1b1b'}
              className="relative font-medium transition-all duration-300 text-sm sm:text-base"
              style={{
                color: activeTab === '14days' ? '#239BCF' : '#1b1b1b'
              }}
            >
              {activeTab === '14days' && (
                <span
                  className="absolute inset-0 -z-10 rounded"
                  style={{
                    backgroundColor: 'rgba(35, 155, 207, 0.1)',
                    boxShadow: '0 0 15px rgba(35, 155, 207, 0.3)'
                  }}
                />
              )}
              Next 14 Days
            </button>

            {/* Animated underline - positioned above the grey border */}
            <div
              className="absolute bottom-0 h-0.5 transition-all duration-500 ease-in-out z-10"
              style={{
                backgroundColor: '#239BCF',
                width: activeTab === 'today' ? '48px' : '105px',
                transform: activeTab === 'today' ? 'translateX(0)' : 'translateX(calc(48px + 1rem))',
                boxShadow: '0 0 10px rgba(35, 155, 207, 0.5)'
              }}
            />
          </div>

          {/* Full-width grey underline */}
          <div className="h-px bg-gray-300 w-full"></div>
        </div>
      </div>


      {/* Main Content Area - fully responsive layout */}
      <div className="pt-40 sm:pt-36 md:pt-35 px-4 sm:px-6 pb-6 flex-1 overflow-y-auto lg:ml-10 max-w-full mobile-content">
        {/* Equipment Section */}
        <Card
          onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
          className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer transition-all select-none outline-none w-full"
          style={{ minHeight: '56px' }}
        >
          <CardContent className="p-3 sm:p-4 bg-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between equipment-header">
              <div className="mb-3 sm:mb-0">
                <h2
                  className="font-medium text-sm"
                  style={{
                    color: '#1b1b1b',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  }}
                >
                  {activeTab === 'today'
                    ? 'Equipment Needed Today'
                    : 'Equipment Needed - Next 14 Days'}
                </h2>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 equipment-stats">
                <p className="text-xs text-gray-500 flex-shrink-0">
                  {visitCount} visits scheduled • {equipmentCount} items
                </p>

                {/* Chevron Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation() // ⛔ Stop bubbling
                    setIsEquipmentExpanded(!isEquipmentExpanded)
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300',
                      isEquipmentExpanded ? 'rotate-180' : ''
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Expandable Content */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-500 ease-in-out',
                isEquipmentExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              )}
            >
              <div className="mt-1 pt-2">
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {currentEquipment.map((eq, i) => (
                    <div
                      key={i}
                      className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs border inline-flex items-center gap-1"
                      style={{ color: '#239BCF', borderColor: '#239BCF' }}
                    >
                      <span className="text-xs">{eq.name}</span>
                      <span className="font-normal text-xs">({eq.visits})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Visits Section */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-medium mb-0" style={{ color: '#1b1b1b' }}>
            {activeTab === 'today' ? "Today's Visits" : "Upcoming Visits"}
          </h3>
        </div>

        {/* Visit Cards Layout */}
        <div className="space-y-4 sm:space-y-6 w-full">
          {activeTab === '14days' ? (
            <>
              {Object.entries(groupedVisits).map(([date, visits]) => (
                <div key={date} className="w-full" ref={el => dateSectionRefs.current[date] = el}>
                  {/* Date Header Wrapper - maintains space when date card is fixed */}
                  <div className="date-card-wrapper" style={{ minHeight: 'fit-content' }}>
                    <div
                      ref={el => dateRefs.current[date] = el}
                      className="date-card rounded-lg px-3 sm:px-4 py-3 w-full mb-4"
                    >
                      <h4 className="text-sm font-medium mb-1">{date}</h4>
                      <span className="text-xs font-medium" style={{ color: '#939090' }}>
                        {visits.length} {visits.length === 1 ? 'Visit' : 'Visits'} Scheduled
                      </span>
                    </div>
                  </div>

                  {/* Responsive layout for 14 days view - fully responsive */}
                  <div className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-sm">
                    {/* Unified responsive grid - works on both mobile and desktop */}
                    <div className="visits-grid-14days">
                      {visits.map(v => (
                        <div key={v.id}>
                          <VisitCard visit={v} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* Single column layout for today's visits - one card per line */
            <div className="visits-grid-today">
              {currentVisits.map((visit) => (
                <div key={visit.id}>
                  <VisitCard visit={visit} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}