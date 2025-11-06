// Visit Types and Interfaces
export type VisitStatus = 'not-started' | 'in-progress' | 'ready-to-save' | 'completed'
export type OutcomeValue = 'completed' | 'not-completed'
export type VisitType = 'in-home' | 'telehealth'

export interface Procedure {
  id: string
  title: string
}

export interface Visit {
  id: string
  patientName: string
  address: string
  time: string
  insurance: string
  visitType: VisitType
  status: VisitStatus
}

export interface VisitOutcome {
  procedureId: string
  outcome: OutcomeValue
  reason?: string
  description?: string
}

export interface VisitState {
  id: string
  patientName: string
  address: string
  time: string
  insurance: string
  status: VisitStatus
  outcomes: Record<string, OutcomeValue>
  procedureReasons: Record<string, string>
}

export interface ConsentForm {
  id: string
  name: string
  key: string
}

export interface ConsentStatus {
  [key: string]: boolean
}

// Reason labels for incomplete procedures
export const REASON_LABELS: Record<string, string> = {
  'connectivity': 'Connectivity',
  'technical-issues': 'Technical Issues',
  'supplies-unavailable': 'Supplies/equipment unavailable',
  'patient-refused': 'Patient Refused',
  'kit-left-behind': 'Kit Left Behind',
  'not-medically-indicated': 'Not Medically Indicated',
  'test-deferred': 'Test Deferred',
  'incomplete-consent': 'Incomplete Consent',
  'safety-concerns': 'Safety Concerns'
}