import { Procedure, ConsentForm } from '../types'

// Demo data and constants
export const PROCEDURES: Procedure[] = [
  { id: 'a1c', title: 'A1C' },
  { id: 'blood-pressure', title: 'Blood Pressure' },
  { id: 'urine-sample', title: 'Urine Sample' },
]

export const CONSENT_FORMS: ConsentForm[] = [
  { id: 'hipaa', name: 'HIPAA Authorization', key: 'hipaa' },
  { id: 'privacy', name: 'Notice of Privacy Practices', key: 'privacy' },
  { id: 'treatment', name: 'Treatment Consent', key: 'treatment' },
]

export const EQUIPMENT_NEEDED = [
  'A1C Kit',
  'Blood Pressure Monitor',
  'Urine Collection Kit'
]

// Demo visit data
export const DEMO_VISITS = [
  {
    id: '1',
    patientName: 'Jane Smith',
    address: '1234 Main Street, Dayton, OH',
    time: '10:30AM',
    insurance: 'UHC',
    visitType: 'in-home' as const,
    status: 'not-started' as const
  }
]

// Storage keys
export const STORAGE_KEYS = {
  VISIT_STATE: (visitId: string) => `visit-state-${visitId}`,
  CONSENT_STATUS: (visitId: string) => `consentFormsStatus-${visitId}`
} as const

// Progress calculation constants
export const TOTAL_OUTCOMES = PROCEDURES.length + 1 // procedures + HRA