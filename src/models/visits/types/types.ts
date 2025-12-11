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
  consentURL?: string
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

// API Types
export interface MemberAddress {
  zip: string
  street: string
  state: string
  city: string
}

export interface LabItem {
  attributes: {
    type: string
    url: string
  }
  PSC_Account__c: string
  Id: string
  PSC_Status__c: string
  PSC_Lab_Type__c: string
  Mapped_Lab_Term?: string[]
}

export interface GapItem {
  attributes: {
    type: string
    url: string
  }
  Account__c: string
  Id: string
  PSC_Type__c: string
  PSC_Status__c: string
  PSC_Measure__c: string
  PSC_Sub_Type__c?: string
  PSC_Measurement_Year__c?: string
  Mapped_Gap_Term?: string
}

export interface VisitApiResponse {
  visitType: string
  visitTime: string
  visitDate: string
  providerTimezone: string
  message: string
  MemberPhone: string
  MemberPayer: string
  memberLastName: string
  memberFirstName: string
  memberAddress: MemberAddress
  labs: LabItem[]
  IsStarted: boolean
  IsCompletedFlag: boolean
  gaps: GapItem[]
  consentURL: string
  consentToTreatment: boolean
  consentToPrivacy: boolean
  consentToHipaa: boolean
  CompletedDate: string | null
  caseNumber: string
  assessmentName: string
  assessmentID: string
  appointmentDatetime: string
}

export type LabOutcome = 'Completed' | 'Not Completed'
export type LabNotCompletedReason = 
  | 'Kit Left Behind'
  | 'Incomplete Consent'
  | 'Not Medically Indicated'
  | 'Patient Refused'
  | 'Safety Concerns'
  | 'Technical Issues'
  | 'Test Deferred'

export interface UpdateLabPayload {
  PSC_Account__c: string
  Id: string
  PSC_Outcome__c: LabOutcome
  PSC_Not_Completed_Reason?: LabNotCompletedReason
}

export interface UpdateGapPayload {
  Id: string
  PSC_Outcome__c: LabOutcome
  PSC_Not_Completed_Reason__c?: LabNotCompletedReason
}

export interface UpdateResponse {
  Operation: string
  Id: string
  ErrorMessage: string | null
}
