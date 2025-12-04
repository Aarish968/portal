// Visit Types
export interface VisitProcedure {
  name: string
  completed?: boolean
}

export interface ConsentForm {
  name: string
  completed?: boolean
}

export interface Visit {
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

export interface EquipmentItem {
  name: string
  visits: number
}

export type TabType = 'today' | 'tomorrow' | 'week'

export interface ConsentStatus {
  hipaa: boolean
  privacy: boolean
  treatment: boolean
}

export interface PendingConsentData {
  visitId: string | null
  consentStatus: ConsentStatus
}
