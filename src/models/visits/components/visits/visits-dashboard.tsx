import { useEffect, useState, useRef, useCallback } from 'react'
import { Clock, MapPin, Building, Phone, Check, ChevronDown, Bell, X, Link, CheckCircle } from 'lucide-react'
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

// Removed unused ButtonProps type

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
    phone: '(570) 555-0001',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    procedures: [
      { name: 'A1C' },
      { name: 'Blood Pressure' },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '2',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    phone: '(570) 555-0002',
    insurance: 'Aetna',
    status: 'not-started',
    visitType: 'telehealth',
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'in-progress',
    consentForms: [
      { name: 'HIPAA Authorization', completed: true },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '3',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    phone: '(570) 555-0003',
    insurance: 'Aetna',
    status: 'not-started',
    visitType: 'telehealth',
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '4',
    patientName: 'John Doe',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    phone: '(570) 555-0004',
    insurance: 'Aetna',
    status: 'not-started',
    visitType: 'telehealth',
    procedures: [
      { name: 'A1C', completed: true },
      { name: 'Blood Pressure', completed: true },
      { name: 'Urine Sample' },
    ],
    healthRiskAssessment: 'in-progress',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices', completed: true },
      { name: 'Treatment Consent' },
    ],
  },
]

const mockVisits14Days: Visit[] = [
  {
    id: '1',
    patientName: 'Emily Davis',
    time: '9:30AM',
    address: '5678 Oak Avenue, Dayton, OH',
    phone: '(570) 555-0101',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '2',
    patientName: 'Brandon Young',
    time: '1:00PM',
    address: '147 Willow Court, Englewo...',
    phone: '(570) 555-0102',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '3',
    patientName: 'Sarah Johnson',
    time: '10:00AM',
    address: '789 Pine Street, Dayton, OH',
    phone: '(570) 555-0103',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '4',
    patientName: 'Michael Brown',
    time: '2:30PM',
    address: '321 Oak Avenue, Dayton, OH',
    phone: '(570) 555-0104',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '5',
    patientName: 'Lisa Wilson',
    time: '11:00AM',
    address: '5678 Oak Avenue, Dayton, OH',
    phone: '(570) 555-0105',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '6',
    patientName: 'David Miller',
    time: '3:00PM',
    address: '456 Elm Street, Dayton, OH',
    phone: '(570) 555-0106',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '7',
    patientName: 'Jennifer Garcia',
    time: '9:00AM',
    address: '654 Maple Drive, Dayton, OH',
    phone: '(570) 555-0107',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '8',
    patientName: 'Robert Taylor',
    time: '1:30PM',
    address: '987 Cedar Lane, Dayton, OH',
    phone: '(570) 555-0108',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '9',
    patientName: 'Maria Rodriguez',
    time: '10:30AM',
    address: '5678 Oak Avenue, Dayton, OH',
    phone: '(570) 555-0109',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '10',
    patientName: 'James Anderson',
    time: '2:00PM',
    address: '123 Birch Street, Dayton, OH',
    phone: '(570) 555-0110',
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
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '11',
    patientName: 'Patricia White',
    time: '4:30PM',
    address: '789 Cedar Avenue, Dayton, OH',
    phone: '(570) 555-0111',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'Blood Pressure' },
      { name: 'Vaccine' },
    ],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '12',
    patientName: 'Thomas Clark',
    time: '6:00PM',
    address: '456 Pine Street, Dayton, OH',
    phone: '(570) 555-0112',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'Lipid Panel' },
      { name: 'HbA1c Test' },
    ],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: '13',
    patientName: 'Piter Clark',
    time: '7:00PM',
    address: '456 Pine Street, Dayton, OH',
    phone: '(570) 555-0113',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Monday, August 12, 2025',
    procedures: [
      { name: 'Lipid Panel' },
      { name: 'HbA1c Test' },
    ],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
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
        backgroundColor: 'rgb(207, 35, 35)',
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
        <X className="w-2 h-2" style={{ color: 'rgb(207, 35, 35)' }} />
      </div>
      <span className="text-xs">{procedure.name}</span>
    </div>
  )
}

function ConsentFormBadge({ consentForm }: { consentForm: ConsentForm }) {
  if (consentForm.completed) {
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
        <span className="text-xs">{consentForm.name}</span>
      </div>
    )
  }
  return (
    <div
      className="px-2 sm:px-3 py-1 text-xs font-medium whitespace-nowrap rounded-full"
      style={{
        margin: '0px',
        fontSize: '0.875rem',
        lineHeight: '1.4',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        color: 'rgb(228, 118, 0)',
        fontWeight: '500',
        backgroundColor: 'rgba(228, 118, 0, 0.1)',
        border: '1px solid rgba(228, 118, 0, 0.3)'
      }}
    >
      {consentForm.name}
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
  const [isLinkCopied, setIsLinkCopied] = useState(false)

  const handleVisitClick = () => {
    navigate(ROUTES.app.visitDetails.href.replace(':visitId', visit.id), { state: { visit } })
  }

  // Get visit state from local storage (shared across tabs)
  const visitState = (() => {
    try {
      const stored = localStorage.getItem(`visit-state-${visit.id}`)
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

    // Check consent forms completion status
    const consentStatus = (() => {
      try {
        const consentData = localStorage.getItem(`consentFormsStatus-${visit.id}`)
        if (consentData) {
          const consent = JSON.parse(consentData)
          return {
            hipaa: consent.hipaa === true,
            privacy: consent.privacy === true,
            treatment: consent.treatment === true
          }
        }
      } catch {
        return {
          hipaa: false,
          privacy: false,
          treatment: false
        }
      }
      return {
        hipaa: false,
        privacy: false,
        treatment: false
      }
    })()

    const completedCount = Object.values(consentStatus).filter(Boolean).length
    const areAllConsentFormsCompleted = completedCount === 3
    const hasOneOrTwoConsentsCompleted = completedCount === 1 || completedCount === 2
    const hasNoConsentsCompleted = completedCount === 0
    const hasTreatmentConsent = consentStatus.treatment === true
    // Only Treatment Consent is collected (no other consents)
    const onlyTreatmentConsentCollected = hasTreatmentConsent && !consentStatus.hipaa && !consentStatus.privacy
    // HIPAA and Privacy collected but Treatment Consent missing
    const hipaaAndPrivacyCollectedButTreatmentMissing = consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment

    // Function to copy consent link
    const handleCopyConsentLink = () => {
      // Store visit data for later use when user submits consent form
      sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
      sessionStorage.setItem('currentVisitId', visit.id)

      // Determine base URL based on environment
      const getBaseUrl = () => {
        const hostname = window.location.hostname
        const protocol = window.location.protocol
        const port = window.location.port

        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return `${protocol}//${hostname}${port ? `:${port}` : ''}`
        }

        // QA environment (you can adjust this pattern based on your QA URL)
        if (hostname.includes('qa') || hostname.includes('staging') || hostname.includes('dev')) {
          return `${protocol}//${hostname}`
        }

        // Production environment
        return `${protocol}//${hostname}`
      }

      const baseUrl = getBaseUrl()
      const consentLink = `${baseUrl}${ROUTES.app.consentForms.href}?visitId=${visit.id}`

      navigator.clipboard.writeText(consentLink).then(() => {
        // Change button state to show success
        setIsLinkCopied(true)
        console.log('Consent link copied to clipboard:', consentLink)

        // Reset button state after 2 seconds
        setTimeout(() => {
          setIsLinkCopied(false)
        }, 2000)
      }).catch(() => {
        console.error('Failed to copy consent link')
        // Could show error state here if needed
      })
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
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '120px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '48px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px'
          }}
        >
          Save
        </button>
      )
    } else if (areAllConsentFormsCompleted) {
      // All consent forms completed → Log Outcomes button
      return (
        <button
          onClick={handleVisitClick}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
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
            borderRadius: '12px'
          }}
        >
          Log Outcomes
        </button>
      )
    } else if (hipaaAndPrivacyCollectedButTreatmentMissing && visit.visitType === 'in-home') {
      // HIPAA + Privacy collected (Treatment missing) → Show only Collect Consent button (In-Home only)
      return (
        <button
          onClick={() => {
            sessionStorage.setItem('fromConsentPage', 'true')
            sessionStorage.setItem('currentVisitId', visit.id)
            // Store visit data for later use
            sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
            window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
          }}
          className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fontSize: '0.875rem',
            lineHeight: '1.75',
            minWidth: '64px',
            textTransform: 'none',
            fontWeight: '500',
            boxShadow: 'none',
            minHeight: '48px',
            backgroundColor: 'rgb(85, 56, 166)',
            color: 'rgb(255, 255, 255)',
            outline: '0px',
            margin: '0px',
            textDecoration: 'none',
            padding: '10px 24px',
            borderWidth: '0px',
            borderStyle: 'initial',
            borderColor: 'initial',
            borderImage: 'initial',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: '12px'
          }}
        >
          Collect Consent
        </button>
      )
    } else if (onlyTreatmentConsentCollected && visit.visitType === 'in-home') {
      // Only Treatment Consent collected → Show both Log Outcomes and Collect Consent buttons (In-Home only)
      return (
        <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
          <button
            onClick={handleVisitClick}
            className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              appearance: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              minWidth: '64px',
              textTransform: 'none',
              fontWeight: '500',
              boxShadow: 'none',
              minHeight: '48px',
              backgroundColor: 'rgb(85, 56, 166)',
              color: 'rgb(255, 255, 255)',
              outline: '0px',
              margin: '0px',
              textDecoration: 'none',
              padding: '10px 24px',
              borderWidth: '0px',
              borderStyle: 'initial',
              borderColor: 'initial',
              borderImage: 'initial',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '12px',
              width: '100%'
            }}
          >
            Log Outcomes
          </button>
          <button
            onClick={() => {
              sessionStorage.setItem('fromConsentPage', 'true')
              sessionStorage.setItem('currentVisitId', visit.id)
              // Store visit data for later use
              sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
              window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
            }}
            className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              appearance: 'none',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: '0.875rem',
              lineHeight: '1.75',
              minWidth: '64px',
              textTransform: 'none',
              fontWeight: '500',
              boxShadow: 'none',
              minHeight: '48px',
              backgroundColor: 'rgb(85, 56, 166)',
              color: 'rgb(255, 255, 255)',
              outline: '0px',
              margin: '0px',
              textDecoration: 'none',
              padding: '10px 24px',
              borderWidth: '0px',
              borderStyle: 'initial',
              borderColor: 'initial',
              borderImage: 'initial',
              transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: '12px',
              width: '100%'
            }}
          >
            Collect Consent
          </button>
        </div>
      )
    } else if (hasOneOrTwoConsentsCompleted) {
      // 1 or 2 consents completed → Different buttons based on visit type and which consents are collected
      if (visit.visitType === 'telehealth') {
        // Telehealth: Check specific consent combinations
        if (consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment) {
          // HIPAA + Privacy collected, Treatment missing → Show only Copy Consent Link button
          return (
            <div className="flex flex-col gap-1" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  borderRadius: '12px',
                  width: '100%',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {isLinkCopied ? 'Link Copied!' : 'Copy Consent Link'}
                <Link className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', marginTop: '2px' }}>
                Copies link to paste in Telehealth chat
              </p>
            </div>
          )
        } else if (consentStatus.treatment && (!consentStatus.hipaa || !consentStatus.privacy)) {
          // Treatment collected with missing HIPAA or Privacy (includes Treatment only, Treatment + HIPAA, Treatment + Privacy) → Show both Log Outcomes and Copy Consent Link buttons
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                {isLinkCopied ? 'Link Copied!' : 'Copy Consent Link'}
                <Link className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', marginTop: '2px' }}>
                Copies link to paste in Telehealth chat
              </p>
            </div>
          )
        } else {
          // Fallback for other combinations → Show both buttons (original behavior)
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={handleCopyConsentLink}
                className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                {isLinkCopied ? 'Link Copied!' : 'Copy Consent Link'}
                <Link className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', marginTop: '2px' }}>
                Copies link to paste in Telehealth chat
              </p>
            </div>
          )
        }
      } else if (visit.visitType === 'in-home') {
        // In-home: Check if HIPAA and Privacy are collected (but not Treatment)
        if (consentStatus.hipaa && consentStatus.privacy && !consentStatus.treatment) {
          // HIPAA + Privacy collected, Treatment missing → Show only Collect Consent button
          return (
            <button
              onClick={() => {
                sessionStorage.setItem('fromConsentPage', 'true')
                sessionStorage.setItem('currentVisitId', visit.id)
                // Store visit data for later use
                sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
              }}
              className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxSizing: 'border-box',
                cursor: 'pointer',
                userSelect: 'none',
                verticalAlign: 'middle',
                appearance: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minWidth: '64px',
                textTransform: 'none',
                fontWeight: '500',
                boxShadow: 'none',
                minHeight: '48px',
                backgroundColor: 'rgb(85, 56, 166)',
                color: 'rgb(255, 255, 255)',
                outline: '0px',
                margin: '0px',
                textDecoration: 'none',
                padding: '10px 24px',
                borderWidth: '0px',
                borderStyle: 'initial',
                borderColor: 'initial',
                borderImage: 'initial',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: '12px'
              }}
            >
              Collect Consent
            </button>
          )
        } else if (consentStatus.treatment && ((consentStatus.hipaa && !consentStatus.privacy) || (!consentStatus.hipaa && consentStatus.privacy))) {
          // Treatment + HIPAA OR Treatment + Privacy (but not both) → Show both Log Outcomes and Collect Consent buttons
          return (
            <div className="flex flex-col gap-3" style={{ alignItems: 'flex-end' }}>
              <button
                onClick={handleVisitClick}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Log Outcomes
              </button>
              <button
                onClick={() => {
                  sessionStorage.setItem('fromConsentPage', 'true')
                  sessionStorage.setItem('currentVisitId', visit.id)
                  // Store visit data for later use
                  sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
                  window.open(`${ROUTES.app.consentForms.href}?visitId=${visit.id}`, '_blank')
                }}
                className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  userSelect: 'none',
                  verticalAlign: 'middle',
                  appearance: 'none',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  minWidth: '64px',
                  textTransform: 'none',
                  fontWeight: '500',
                  boxShadow: 'none',
                  minHeight: '48px',
                  backgroundColor: 'rgb(85, 56, 166)',
                  color: 'rgb(255, 255, 255)',
                  outline: '0px',
                  margin: '0px',
                  textDecoration: 'none',
                  padding: '10px 24px',
                  borderWidth: '0px',
                  borderStyle: 'initial',
                  borderColor: 'initial',
                  borderImage: 'initial',
                  transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '12px',
                  width: '100%'
                }}
              >
                Collect Consent
              </button>
            </div>
          )
        } else {
          // Other combinations (like only Treatment collected) → Show Log Outcomes button
          return (
            <button
              onClick={handleVisitClick}
              className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxSizing: 'border-box',
                cursor: 'pointer',
                userSelect: 'none',
                verticalAlign: 'middle',
                appearance: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minWidth: '64px',
                textTransform: 'none',
                fontWeight: '500',
                boxShadow: 'none',
                minHeight: '48px',
                backgroundColor: 'rgb(85, 56, 166)',
                color: 'rgb(255, 255, 255)',
                outline: '0px',
                margin: '0px',
                textDecoration: 'none',
                padding: '10px 24px',
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

      // Fallback
      return null
    } else {
      // For telehealth visits with no consents completed, show Copy Consent Link button
      if (visit.visitType === 'telehealth' && hasNoConsentsCompleted) {
        return (
          <div className="flex flex-col gap-1" style={{ alignItems: 'flex-end' }}>
            <button
              onClick={handleCopyConsentLink}
              className="inline-flex items-center justify-center gap-2 relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxSizing: 'border-box',
                cursor: 'pointer',
                userSelect: 'none',
                verticalAlign: 'middle',
                appearance: 'none',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                minWidth: '64px',
                textTransform: 'none',
                fontWeight: '500',
                boxShadow: 'none',
                minHeight: '48px',
                backgroundColor: 'rgb(85, 56, 166)',
                color: 'rgb(255, 255, 255)',
                outline: '0px',
                margin: '0px',
                textDecoration: 'none',
                padding: '10px 24px',
                borderWidth: '0px',
                borderStyle: 'initial',
                borderColor: 'initial',
                borderImage: 'initial',
                borderRadius: '12px',
                width: '100%',
                transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1), border-color 250ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {isLinkCopied ? 'Link Copied!' : 'Copy Consent Link'}
              <Link className="w-4 h-4" />
            </button>
            <p className="text-xs text-gray-500" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', marginTop: '2px' }}>
              Copies link to paste in Telehealth chat
            </p>
          </div>
        )
      }

      // For in-home visits with no consents completed, show Collect Consent button
      if (visit.visitType === 'in-home' && hasNoConsentsCompleted) {
        return (
          <button
            onClick={() => {
              sessionStorage.setItem('fromConsentPage', 'true')
              sessionStorage.setItem('currentVisitId', visit.id)
              // Store visit data for later use
              sessionStorage.setItem(`visit-${visit.id}`, JSON.stringify(visit))
              window.open(ROUTES.app.consentForms.href, '_blank')
            }}
            className="inline-flex items-center justify-center relative box-border cursor-pointer select-none align-middle appearance-none font-medium transition-all"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxSizing: 'border-box',
              cursor: 'pointer',
              userSelect: 'none',
              verticalAlign: 'middle',
              appearance: 'none',
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
              borderRadius: '12px'
            }}
          >
            Collect Consent
          </button>
        )
      }

      // Fallback for any other cases
      return null
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
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer h-full" style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col visit-card-content" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 text-sm min-w-0 visit-details-mobile" style={{ color: '#939090', maxWidth: '100%', overflow: 'hidden' }}>
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

            {/* Phone Number */}
            {visit.phone && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm whitespace-nowrap">{visit.phone}</span>
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

          {/* Consent Forms */}
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <h4 className="text-xs font-medium text-gray-700 mb-2 sm:mb-3 tracking-wide">
              Consent Forms:
            </h4>
            <div className="flex flex-wrap gap-6 items-start" style={{ maxWidth: '100%' }}>
              {(() => {
                // Read consent record once to decide whether to show statuses
                let consentRecord: any | null = null
                let showStatuses = false
                try {
                  const consentDataRaw = localStorage.getItem(`consentFormsStatus-${visit.id}`)
                  if (consentDataRaw) {
                    consentRecord = JSON.parse(consentDataRaw)
                    showStatuses = consentRecord?.submitted === true
                  }
                } catch { }

                return visit.consentForms.map((cf, i) => {
                  // Determine completion only if we have a record
                  const isCompleted = (() => {
                    if (!consentRecord) return false
                    if (cf.name === 'HIPAA Authorization') return consentRecord.hipaa === true
                    if (cf.name === 'Notice of Privacy Practices') return consentRecord.privacy === true
                    if (cf.name === 'Treatment Consent') return consentRecord.treatment === true
                    return false
                  })()

                  return (
                    <div key={i} className="flex flex-col gap-1">
                      {showStatuses ? (
                        isCompleted ? (
                          <div
                            className="inline-flex items-center text-white text-xs font-medium"
                            style={{
                              backgroundColor: 'rgb(25, 154, 146)',
                              height: '24px',
                              borderRadius: '9999px',
                              padding: '0 12px',
                              gap: '8px',
                              width: '90px',
                              justifyContent: 'center'
                            }}
                          >
                            <span
                              className="inline-flex items-center justify-center"
                              style={{
                                width: '20px',
                                height: '10px',
                                borderRadius: '9999px',
                                backgroundColor: '#FFFFFF'
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 16 16" fill="none">
                                <path d="M6.5 11.3L3.5 8.3L4.55 7.25L6.5 9.2L11.45 4.25L12.5 5.3L6.5 11.3Z" fill="#199A92" />
                              </svg>
                            </span>
                            <span>Collected</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium" style={{ color: 'rgb(207, 35, 35)', height: '24px' }}>Missing</span>
                        )
                      ) : null}
                      <span style={{
                        fontSize: '0.875rem',
                        lineHeight: '1.4',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        color: showStatuses ? '#1B1B1B' : 'rgb(228, 118, 0)',
                        fontWeight: 500
                      }}>
                        {cf.name}
                      </span>
                    </div>
                  )
                })
              })()}
            </div>
          </div>

          {/* Second Separator Line */}
          <div className="border-t border-gray-200"></div>

          {/* Procedures */}
          <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <h4 className="text-xs font-medium text-gray-700 mb-2 sm:mb-3 tracking-wide">
              Required Procedures
            </h4>
            <div className="flex flex-wrap gap-2 procedures-mobile" style={{ maxWidth: '100%' }}>
              {visit.procedures.map((p, i) => {
                // Map procedure names to IDs used in visit details
                const procedureIdMap: Record<string, string> = {
                  'A1C': 'a1c',
                  'Blood Pressure': 'blood-pressure',
                  'Urine Sample': 'urine-sample'
                }

                const procedureId = procedureIdMap[p.name] || p.name.toLowerCase().replace(/\s+/g, '-')
                // Determine status: completed, not-completed, or pending (no outcome yet)
                const outcome = visitState?.outcomes?.[procedureId]
                const isCompleted = outcome === 'completed'
                const isNotCompleted = outcome === 'not-completed'

                return (
                  <div
                    key={i}
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
                      height: '32px',
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      backgroundColor: isCompleted ? 'rgb(25, 154, 146)' : (isNotCompleted ? 'rgb(207, 35, 35)' : 'white'),
                      color: isCompleted || isNotCompleted ? 'rgb(255, 255, 255)' : '#1B1B1B',
                      whiteSpace: 'nowrap',
                      transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                      outline: '0px',
                      textDecoration: 'none',
                      border: isCompleted || isNotCompleted ? '0px' : '1px solid rgb(229, 231, 235)',
                      padding: '0px 12px',
                      borderRadius: '999px'
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" style={{ color: 'rgb(25, 154, 146)' }} />
                        </div>
                        <span>{p.name}</span>
                      </>
                    ) : isNotCompleted ? (
                      <>
                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3" style={{ color: 'rgb(207, 35, 35)' }} />
                        </div>
                        <span>{p.name}</span>
                      </>
                    ) : (
                      <>
                        <span>{p.name}</span>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Third Separator Line */}
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
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('today')
  const [visitsToday, setVisitsToday] = useState<Visit[]>(mockVisitsToday)
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false)
  const [time, setTime] = useState('')
  const [showConsentModal, setShowConsentModal] = useState(false)
  const [showConsentConfirmation, setShowConsentConfirmation] = useState(false)
  const [pendingConsentData, setPendingConsentData] = useState<any>(null)
  const [showConsentLoading, setShowConsentLoading] = useState(false)
  const [showConsentSuccess, setShowConsentSuccess] = useState(false)
  // Removed unused refreshTrigger state
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Handle consent confirmation
  const handleConsentConfirmation = () => {
    setShowConsentConfirmation(false)
    setShowConsentLoading(true)

    // After 2 seconds, show success
    setTimeout(() => {
      setShowConsentLoading(false)
      setShowConsentSuccess(true)

      // Refresh visit states to update the cards
      refreshVisitStates()
      // Force re-render by updating a state
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))

      // After 1 second, close the success modal and stay on visit outcomes page
      setTimeout(() => {
        setShowConsentSuccess(false)
        setPendingConsentData(null)
        // User stays on visit outcomes page - no navigation to visit details
      }, 1000)
    }, 2000)
  }
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
        const raw = localStorage.getItem(`visit-state-${v.id}`)
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

  // Check consent status and show modal if needed
  const checkConsentStatus = useCallback(() => {
    try {
      // Get visit ID from sessionStorage
      const visitId = sessionStorage.getItem('currentVisitId')
      if (!visitId) {
        // If no visit ID, check general consent status
        const consentData = localStorage.getItem('consentFormsStatus')
        if (consentData) {
          const consent = JSON.parse(consentData)
          const completedCount = [consent.hipaa, consent.privacy, consent.treatment].filter(Boolean).length
          // Show modal ONLY when zero consents are completed
          if (completedCount === 0) {
            setShowConsentModal(true)
          }
        } else {
          setShowConsentModal(true)
        }
      } else {
        // Check consent status for specific visit
        const consentData = localStorage.getItem(`consentFormsStatus-${visitId}`)
        if (consentData) {
          const consent = JSON.parse(consentData)
          const completedCount = [consent.hipaa, consent.privacy, consent.treatment].filter(Boolean).length
          // Show modal ONLY when zero consents are completed
          if (completedCount === 0) {
            setShowConsentModal(true)
          }
        } else {
          // No consent data found, show modal
          setShowConsentModal(true)
        }
      }
    } catch {
      // Error parsing, show modal
      setShowConsentModal(true)
    }
  }, [])

  // Check consent status on mount and when window gains focus
  useEffect(() => {
    // Only check if user came from consent forms page (check sessionStorage flag)
    const fromConsentPage = sessionStorage.getItem('fromConsentPage')
    if (fromConsentPage === 'true') {
      sessionStorage.removeItem('fromConsentPage')
      checkConsentStatus()
    }
  }, [checkConsentStatus])

  // Listen for consent submission messages from child windows
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== window.location.origin) return

      if (event.data.type === 'CONSENT_SUBMITTED') {
        console.log('Consent submitted for visit:', event.data.visitId)
        // Refresh visit states to update the cards
        refreshVisitStates()
        // Force re-render by updating a state
        setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [refreshVisitStates])

  // Listen for localStorage changes (consent submissions from other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'consentSubmissionEvent' && event.newValue) {
        try {
          const eventData = JSON.parse(event.newValue)
          if (eventData.type === 'CONSENT_SUBMITTED') {
            console.log('Consent submitted in another tab for visit:', eventData.visitId)
            // Store pending consent data and show confirmation popup
            setPendingConsentData(eventData)
            setShowConsentConfirmation(true)
          }
        } catch (error) {
          console.error('Error parsing consent submission event:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Refresh data when window gains focus (user navigates back)
  useEffect(() => {
    const handleFocus = () => {
      refreshVisitStates()
      // Check consent when window gains focus (user might have navigated back)
      const fromConsentPage = sessionStorage.getItem('fromConsentPage')
      if (fromConsentPage === 'true') {
        sessionStorage.removeItem('fromConsentPage')
        checkConsentStatus()
      }
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

  // Refresh on window focus only (remove the 500ms interval that causes flickering)
  useEffect(() => {
    const handleFocus = () => {
      // Removed setRefreshTrigger call
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Scroll detection for making date cards sticky (restored from working old code)
  const handleScroll = useCallback(() => {
    if (activeTab !== '14days') return

    try {
      // Responsive header heights and positioning
      const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth)
      const isMobile = viewportWidth < 640
      const isVerySmallMobile = viewportWidth <= 389
      const isSmallMobile = viewportWidth >= 390 && viewportWidth <= 638

      // Adjust header height based on screen size
      let headerHeight = 135 // Default desktop
      if (isVerySmallMobile) {
        headerHeight = 200 // Very small mobile (389px and below)
      } else if (isSmallMobile) {
        headerHeight = 180 // Small mobile (390px - 638px) - reduced spacing
      }

      // Removed unused sidebarWidth variable

      // Get all date entries and sort them by their position in the DOM
      const sortedEntries = Object.entries(groupedVisits).sort((a, b) => {
        const aElement = dateSectionRefs.current[a[0]]
        const bElement = dateSectionRefs.current[b[0]]
        if (!aElement || !bElement) return 0
        return aElement.getBoundingClientRect().top - bElement.getBoundingClientRect().top
      })

      // First pass: reset all date cards to normal state
      sortedEntries.forEach(([date]) => {
        const dateElement = dateRefs.current[date]
        const dateSectionElement = dateSectionRefs.current[date]

        if (!dateElement || !dateSectionElement) return

        const wrapper = dateElement.parentElement

        // Reset to normal state
        dateElement.style.position = ''
        dateElement.style.top = ''
        dateElement.style.left = ''
        dateElement.style.width = ''
        dateElement.style.zIndex = ''
        dateElement.style.marginBottom = ''
        if (wrapper) wrapper.style.height = ''
      })

      // Find the topmost section that should have a sticky date card
      let activeDateCard = null

      for (let i = 0; i < sortedEntries.length; i++) {
        const [date] = sortedEntries[i]
        const dateElement = dateRefs.current[date]
        const dateSectionElement = dateSectionRefs.current[date]

        if (!dateElement || !dateSectionElement) continue

        const whiteContainer = dateSectionElement.querySelector('.bg-white.rounded-lg')
        if (!whiteContainer) continue

        // Store original dimensions once
        if (!dateElement.dataset.originalHeight) {
          dateElement.dataset.originalHeight = dateElement.offsetHeight.toString()
        }
        const originalHeight = parseInt(dateElement.dataset.originalHeight)

        const sectionRect = dateSectionElement.getBoundingClientRect()
        const containerRect = whiteContainer.getBoundingClientRect()

        const sectionTop = sectionRect.top
        const containerBottom = containerRect.bottom

        // Check if this section is in the "active zone"
        // Active zone: section has started (sectionTop <= headerHeight) 
        // AND container hasn't completely passed (containerBottom > headerHeight)
        if (sectionTop <= headerHeight && containerBottom > headerHeight) {
          activeDateCard = { date, dateElement, dateSectionElement, whiteContainer, originalHeight, index: i }
          break // Take the first (topmost) active section
        }
      }

      // Apply sticky behavior only to the active date card
      if (activeDateCard) {
        const { dateElement, whiteContainer, originalHeight, index } = activeDateCard
        const wrapper = dateElement.parentElement

        const containerRect = whiteContainer.getBoundingClientRect()
        const containerBottom = containerRect.bottom
        const zIndex = 10 + index
        const dateCardBottom = headerHeight + originalHeight

        if (containerBottom > dateCardBottom) {
          // Fixed state - date card is sticky at header
          dateElement.style.position = 'fixed'
          dateElement.style.top = `${headerHeight}px`
        } else {
          // Stopped state - date card moves with container bottom
          dateElement.style.position = 'fixed'
          dateElement.style.top = `${containerBottom - originalHeight}px`
        }

        // Set positioning and size
        if (isMobile) {
          dateElement.style.width = `${containerRect.width}px`
          dateElement.style.left = `${containerRect.left}px`
        } else {
          dateElement.style.left = `${containerRect.left}px`
          dateElement.style.width = `${containerRect.width}px`
        }

        dateElement.style.zIndex = zIndex.toString()
        dateElement.style.marginBottom = '0'
        if (wrapper) wrapper.style.height = `${originalHeight}px`
      }
    } catch (error) {
      console.error('Scroll error:', error)
    }
  }, [activeTab, groupedVisits])

  useEffect(() => {
    let ticking = false

    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    if (activeTab === '14days') {
      // Initial call to set positions
      handleScroll()

      window.addEventListener('scroll', throttledHandleScroll, { passive: true })
      window.addEventListener('resize', throttledHandleScroll, { passive: true })

      return () => {
        window.removeEventListener('scroll', throttledHandleScroll)
        window.removeEventListener('resize', throttledHandleScroll)

        // Reset all date card styles when switching tabs (like old code)
        Object.values(dateRefs.current).forEach(element => {
          if (element) {
            const wrapper = element.parentElement

            element.style.position = ''
            element.style.top = ''
            element.style.zIndex = ''
            element.style.width = ''
            element.style.left = ''
            element.style.right = ''
            element.style.maxWidth = ''
            element.style.margin = ''
            element.style.marginBottom = ''
            element.style.transition = 'none'

            if (wrapper) wrapper.style.height = ''
          }
        })
      }
    } else {
      // Reset all date card styles when not on 14days tab (like old code)
      Object.values(dateRefs.current).forEach(element => {
        if (element) {
          const wrapper = element.parentElement

          element.style.position = ''
          element.style.top = ''
          element.style.zIndex = ''
          element.style.width = ''
          element.style.left = ''
          element.style.right = ''
          element.style.maxWidth = ''
          element.style.margin = ''
          element.style.marginBottom = ''
          element.style.transition = 'none'

          if (wrapper) wrapper.style.height = ''
        }
      })
    }
  }, [activeTab, handleScroll])



  return (
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Custom styles for responsive zoom behavior and mobile fixes */}
      <style>{`
        /* Global container fix */
        * {
          box-sizing: border-box !important;
        }
        
        body, html {
          overflow-x: hidden !important;
          max-width: 100vw !important;
          width: 100% !important;
        }
        
        /* Prevent horizontal overflow on all containers */
        .min-h-screen {
          max-width: 100vw !important;
          overflow-x: hidden !important;
        }
        
        /* Small mobile (up to 34.375rem / 550px) - No sidebar */
        @media (max-width: 34.375rem) {
          .mobile-header {
            left: 12.3rem !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
            margin-left: 0 !important;
            padding-left: 0rem !important;
            padding-right: 0.75rem !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          
          .mobile-content {
            padding-top: 12rem !important;
            padding-left: 3rem !important;
            padding-right: 0.75rem !important;
            margin-left: 0 !important;
            width: 100% !important;
            max-width: 100vw !important;
            box-sizing: border-box !important;
          }
        }
        
        /* Shared mobile styles (up to 34.375rem / 550px) */
        @media (max-width: 34.375rem) {
          /* Force single column layout on mobile */
          .visits-grid-14days {
            display: block !important;
            grid-template-columns: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .visits-grid-14days > div {
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
            box-sizing: border-box !important;
          }
          
          /* Mobile visit card styling */
          .visit-card-mobile {
            width: 100% !important;
            max-width: 100% !important;
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
          
          /* Reduce white container padding */
          .white-container {
            padding: 0.75rem !important;
          }
        }
        
        /* Tablet responsive fixes (34.375rem to 64rem / 550px - 1024px) */
        @media (min-width: 34.375rem) and (max-width: 64rem) {
          .mobile-header {
            left: 12.3rem !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
            width: auto !important;
            max-width: calc(100vw - 12rem) !important;
            padding-left: 0rem !important;
            padding-right: 1.5rem !important;
          }
          
          .mobile-content {
            padding-top: 10rem !important;
            padding-left: 3rem !important;
            padding-right: 1.5rem !important;
            margin-left: 1rem !important;
            width: calc(100vw - 12rem) !important;
            max-width: calc(100vw - 12rem) !important;
            box-sizing: border-box !important;
          }
          
          /* Tablet: single column for 14 days view */
          .visits-grid-14days {
            display: block !important;
            grid-template-columns: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .visits-grid-14days > div {
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
            box-sizing: border-box !important;
          }
        }
        
        /* Desktop: maintain current layout (above 64rem / 1024px) */
        @media (min-width: 64rem) {
          .mobile-header {
            left: 12.3rem !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
            width: auto !important;
            max-width: calc(100vw - 12rem) !important;
            padding-left: 0rem !important;
            padding-right: 0rem !important;
          }
          
          .mobile-content {
            padding-top: 10rem !important;
            padding-left: 3rem !important;
            padding-right: 1.5rem !important;
            margin-left: 1rem !important;
            width: calc(100vw - 12rem) !important;
            max-width: calc(100vw - 12rem) !important;
            box-sizing: border-box !important;
          }
          
          .visits-grid-14days {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .visits-grid-14days > div {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
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
        
        /* Date card styling - simplified like old code */
        .date-card {
          background-color: rgb(247, 252, 255) !important;
          border: 1px solid rgb(232, 244, 253) !important;
          color: #239BCF !important;
          margin-bottom: 0 !important;
          backdrop-filter: blur(8px) !important;
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
        @media (max-width: 34.375rem) {
          .visit-card-content {
            padding: 0.75rem !important;
          }
          
          .visit-card-content h3 {
            font-size: 0.95rem !important;
            line-height: 1.25 !important;
          }
          
          .visit-card-content .text-sm {
            font-size: 0.8rem !important;
          }
          
          .visit-card-content .text-xs {
            font-size: 0.7rem !important;
          }
        }
        
        /* Equipment section mobile fixes */
        @media (max-width: 34.375rem) {
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
        
        /* Additional overflow prevention for all screen sizes */
        .date-section-container,
        .white-container,
        .visits-section-container {
          max-width: 100% !important;
          overflow-x: hidden !important;
          box-sizing: border-box !important;
        }
        
        /* Ensure cards don't overflow */
        .bg-white.rounded-lg {
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        /* Fix for very small screens */
        @media (max-width: 389px) {
          .visit-card-content {
            padding: 0.75rem !important;
          }
          
          .text-sm {
            font-size: 0.8rem !important;
          }
          
          .text-xs {
            font-size: 0.7rem !important;
          }
        }
      `}</style>
      {/* Fixed Header - fully responsive */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm mobile-header">
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
      <div className="pt-40 sm:pt-36 md:pt-35 px-4 sm:px-6 pb-6 flex-1 overflow-x-hidden mobile-content" style={{ maxWidth: '100%', boxSizing: 'border-box' }}>
        {/* Equipment Section */}
        <Card
          onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
          className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer transition-all select-none outline-none w-full"
          style={{ minHeight: '56px', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
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
        <div className="space-y-4 sm:space-y-6 w-full visits-section-container" style={{ maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          {activeTab === '14days' ? (
            <>
              {Object.entries(groupedVisits).map(([date, visits]) => (
                <div key={date} className="w-full date-section-container" ref={el => dateSectionRefs.current[date] = el} style={{ maxWidth: '100%', overflow: 'hidden' }}>
                  {/* Date Header Wrapper - maintains space when date card is fixed */}
                  <div className="date-card-wrapper" style={{ minHeight: 'fit-content', maxWidth: '100%' }}>
                    <div
                      ref={el => dateRefs.current[date] = el}
                      className="date-card rounded-lg px-3 sm:px-4 py-3 w-full"
                      style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                    >
                      <h4 className="text-sm font-medium mb-1">{date}</h4>
                      <span className="text-xs font-medium" style={{ color: '#939090' }}>
                        {visits.length} {visits.length === 1 ? 'Visit' : 'Visits'} Scheduled
                      </span>
                    </div>
                  </div>

                  {/* Responsive layout for 14 days view - fully responsive */}
                  <div className="w-full bg-white rounded-lg shadow-sm white-container" style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', padding: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
                    {/* Unified responsive grid - works on both mobile and desktop */}
                    <div className="visits-grid-14days" style={{ maxWidth: '100%', width: '100%' }}>
                      {visits.map(v => (
                        <div key={v.id} style={{ maxWidth: '100%', width: '100%' }}>
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

        {/* Consent Modal */}
        {showConsentModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowConsentModal(false)
              }
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#DC2626',
                marginBottom: '12px'
              }}>
                Consent Document Not Found.
              </h2>

              {/* Description */}
              <p style={{
                fontSize: '14px',
                color: '#4B5563',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                We weren't able to confirm the patient's consent. This may be due to a delay in data syncing, or the document may not have been uploaded yet.
              </p>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                width: '100%',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => {
                    // Just close modal and stay on Visit Outcomes page
                    setShowConsentModal(false)
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#5538A6',
                    border: '1px solid #5538A6',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  Collect Consent
                </button>
                <button
                  onClick={() => {
                    setShowConsentModal(false)
                    // Get visit ID from current context or first visit
                    const firstVisit = currentVisits[0]
                    if (firstVisit) {
                      sessionStorage.setItem('currentVisitId', firstVisit.id)
                    }
                    // Navigate to consent forms page
                    navigate(ROUTES.app.consentForms.href)
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#5538A6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#462D8A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#5538A6'
                  }}
                >
                  Retry Check
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Consent Confirmation Modal */}
        {showConsentConfirmation && pendingConsentData && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '16px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowConsentConfirmation(false)
                setPendingConsentData(null)
              }
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1b1b1b',
                marginBottom: '12px'
              }}>
                Collected consent?
              </h2>

              <p style={{
                fontSize: '14px',
                color: '#4B5563',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}>
                Please verify that you have collected the required consent forms for this visit. You will not be able to begin this visit until all required consents have been obtained.
              </p>

              <div style={{ marginBottom: '24px' }}>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  Missing Consent Forms:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {!pendingConsentData.consentStatus.hipaa && (
                    <span style={{
                      backgroundColor: '#DC2626',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      HIPAA Authorization
                    </span>
                  )}
                  {!pendingConsentData.consentStatus.privacy && (
                    <span style={{
                      backgroundColor: '#DC2626',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Notice of Privacy Practices
                    </span>
                  )}
                  {!pendingConsentData.consentStatus.treatment && (
                    <span style={{
                      backgroundColor: '#DC2626',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      Treatment Consent
                    </span>
                  )}
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                width: '100%',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => {
                    // Clear consent data from localStorage when user clicks No
                    if (pendingConsentData?.visitId) {
                      localStorage.removeItem(`consentFormsStatus-${pendingConsentData.visitId}`)
                      // Also clear any localStorage event
                      localStorage.removeItem('consentSubmissionEvent')
                    } else {
                      localStorage.removeItem('consentFormsStatus')
                      localStorage.removeItem('consentSubmissionEvent')
                    }
                    setShowConsentConfirmation(false)
                    setPendingConsentData(null)
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#CF2323',
                    border: '1px solid #CF2323',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF5F5'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white'
                  }}
                >
                  No
                </button>
                <button
                  onClick={handleConsentConfirmation}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#5538A6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '140px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#462D8A'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#5538A6'
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Consent Loading Modal */}
        {showConsentLoading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: '16px'
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #E5E7EB',
                  borderTop: '4px solid #5538A6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}
              />
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <p style={{
                fontSize: '16px',
                color: '#1b1b1b',
                fontWeight: '500',
                margin: 0
              }}>
                Processing...
              </p>
            </div>
          </div>
        )}

        {/* Consent Success Modal */}
        {showConsentSuccess && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1002,
              padding: '16px'
            }}
          >
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckCircle size={32} style={{ color: '#059669' }} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1b1b1b',
                  margin: '0 0 8px 0'
                }}>
                  Success!
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: 0
                }}>
                  Consent forms have been collected successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}