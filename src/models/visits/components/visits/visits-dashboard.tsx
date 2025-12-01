import { VisitCard } from './visit-card'
import { useEffect, useState, useRef, useCallback,} from 'react'
import {  Bell, ChevronDown,  CheckCircle } from 'lucide-react'
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

const equipmentDataTomorrow = [
  { name: 'HbA1c Kit', visits: 2 },
  { name: 'Lipid Panel Kit', visits: 1 },
  { name: 'Retinal Camera', visits: 1 },
  { name: 'Portable ECG/EKG', visits: 1 },
  { name: 'Vaccine Kit', visits: 1 },
]

const equipmentDataWeek = [
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
      { name: 'Blood Pressure', completed: true},
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

const mockVisitsTomorrow: Visit[] = [
  {
    id: 'tom-1',
    patientName: 'Sarah Williams',
    time: '9:00AM',
    address: '789 Maple Street, Dayton, OH',
    phone: '(570) 555-1001',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'in-home',
    procedures: [{ name: 'HbA1c Test' }, { name: 'Blood Pressure' }, { name: 'Lipid Panel' }],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: 'tom-2',
    patientName: 'Michael Chen',
    time: '10:30AM',
    address: '456 Pine Avenue, Dayton, OH',
    phone: '(570) 555-1002',
    insurance: 'BCBS',
    status: 'not-started',
    visitType: 'telehealth',
    procedures: [{ name: 'Retinal Screening' }, { name: 'Blood Pressure' }],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
  {
    id: 'tom-3',
    patientName: 'Emily Rodriguez',
    time: '1:00PM',
    address: '321 Cedar Lane, Dayton, OH',
    phone: '(570) 555-1003',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    procedures: [{ name: 'EKG' }, { name: 'Vaccine' }, { name: 'Blood Pressure' }],
    healthRiskAssessment: 'not-started',
    consentForms: [
      { name: 'HIPAA Authorization' },
      { name: 'Notice of Privacy Practices' },
      { name: 'Treatment Consent' },
    ],
  },
]

const mockVisitsWeek: Visit[] = [
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

export function VisitsDashboard() {
  const [activeTab, setActiveTab] = useState<'today' | 'tomorrow' | 'week'>('today')
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
  const todayTabRef = useRef<HTMLButtonElement>(null)
  const tomorrowTabRef = useRef<HTMLButtonElement>(null)
  const weekTabRef = useRef<HTMLButtonElement>(null)
  const [underlineStyle, setUnderlineStyle] = useState({ width: 0, left: 0 })

  // Calculate underline position based on active tab
  useEffect(() => {
    const updateUnderlinePosition = () => {
      let targetRef = todayTabRef
      if (activeTab === 'tomorrow') targetRef = tomorrowTabRef
      if (activeTab === 'week') targetRef = weekTabRef

      if (targetRef.current) {
        const { offsetLeft, offsetWidth } = targetRef.current
        setUnderlineStyle({ width: offsetWidth, left: offsetLeft })
      }
    }

    updateUnderlinePosition()
    window.addEventListener('resize', updateUnderlinePosition)
    return () => window.removeEventListener('resize', updateUnderlinePosition)
  }, [activeTab])

  // Handle consent confirmation
  const handleConsentConfirmation = () => {
    // Close "Collected consent?" modal
    setShowConsentConfirmation(false)

    // Check if all 3 consents are missing
    const consentStatus = pendingConsentData?.consentStatus
    const allThreeMissing = !consentStatus?.hipaa && !consentStatus?.privacy && !consentStatus?.treatment

    if (allThreeMissing) {
      // Show "Consent Document Not Found" modal
      setShowConsentModal(true)
    } else {
      // Show loading → success → stay on dashboard
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
  }
  const dateSectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const currentVisits =
    activeTab === 'today' ? visitsToday : activeTab === 'tomorrow' ? mockVisitsTomorrow : mockVisitsWeek
  const currentEquipment =
    activeTab === 'today'
      ? equipmentDataToday
      : activeTab === 'tomorrow'
        ? equipmentDataTomorrow
        : equipmentDataWeek
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
          // Show "Collected consent?" modal ONLY when all 3 consents are missing
          if (completedCount === 0) {
            // Store consent status for later use in confirmation modal
            setPendingConsentData({
              visitId: null,
              consentStatus: consent
            })
            setShowConsentConfirmation(true)
          }
        } else {
          // No consent data found, show "Collected consent?" modal
          setPendingConsentData({
            visitId: null,
            consentStatus: { hipaa: false, privacy: false, treatment: false }
          })
          setShowConsentConfirmation(true)
        }
      } else {
        // Check consent status for specific visit
        const consentData = localStorage.getItem(`consentFormsStatus-${visitId}`)
        if (consentData) {
          const consent = JSON.parse(consentData)
          const completedCount = [consent.hipaa, consent.privacy, consent.treatment].filter(Boolean).length
          // Show "Collected consent?" modal ONLY when all 3 consents are missing
          if (completedCount === 0) {
            // Store consent status for later use in confirmation modal
            setPendingConsentData({
              visitId,
              consentStatus: consent
            })
            setShowConsentConfirmation(true)
          }
        } else {
          // No consent data found, show "Collected consent?" modal
          setPendingConsentData({
            visitId,
            consentStatus: { hipaa: false, privacy: false, treatment: false }
          })
          setShowConsentConfirmation(true)
        }
      }
    } catch {
      // Error parsing, show "Collected consent?" modal
      setPendingConsentData({
        visitId: null,
        consentStatus: { hipaa: false, privacy: false, treatment: false }
      })
      setShowConsentConfirmation(true)
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
    if (activeTab !== 'week') return

    try {
      // Responsive header heights and positioning
      const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth)
      const isMobile = viewportWidth < 640
      const isVerySmallMobile = viewportWidth <= 389
      const isSmallMobile = viewportWidth >= 390 && viewportWidth <= 638

      // Adjust header height based on screen size
      let headerHeight = 135 // Default desktop
      if (isVerySmallMobile) {
        headerHeight = 220 // Very small mobile (389px and below)
      } else if (isSmallMobile) {
        headerHeight = 220 // Small mobile (390px - 638px) - same as very small
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

    if (activeTab === 'week') {
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
      // Reset all date card styles when not on week tab (like old code)
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
    <div className="min-h-screen bg-gray-85 w-full overflow-x-hidden">
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
        
        /* Mobile tabs responsive fixes */
        /* Very small screens - 354px and below */
        @media (max-width: 354px) {
          .mobile-tabs {
            gap: 0.188rem !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .mobile-tabs::-webkit-scrollbar {
            display: none !important;
          }
          .mobile-tabs button {
            font-size: 0.563rem !important;
            padding: 0.125rem 0.25rem !important;
            flex-shrink: 0 !important;
            letter-spacing: -0.02em !important;
          }
        }
        
        /* Small screens - 355px to 377px */
        @media (min-width: 355px) and (max-width: 377px) {
          .mobile-tabs {
            gap: 0.5rem !important;
          }
          .mobile-tabs button {
            font-size: 0.75rem !important;
          }
        }
        
        @media (min-width: 378px) and (max-width: 389px) {
          .mobile-tabs {
            gap: 0.625rem !important;
          }
          .mobile-tabs button {
            font-size: 0.813rem !important;
          }
        }
        
        @media (min-width: 390px) and (max-width: 454px) {
          .mobile-tabs {
            gap: 0.75rem !important;
          }
          .mobile-tabs button {
            font-size: 0.875rem !important;
          }
        }
        
        /* Extra small mobile (up to 22.125rem / 354px) - Reduce header text */
        @media (max-width: 22.125rem) {
          .mobile-header {
            left: 12.3rem !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
            margin-left: 0 !important;
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
            width: calc(100vw - 12.3rem) !important;
            max-width: calc(100vw - 12.3rem) !important;
            box-sizing: border-box !important;
          }
          
          /* Reduce tabs container padding */
          .mobile-header > div {
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
          }
          
          /* Reduce header text size to prevent height increase */
          .mobile-header h1 {
            font-size: 0.875rem !important;
            line-height: 1.2 !important;
          }
          
          .mobile-header p,
          .mobile-header span {
            font-size: 0.75rem !important;
            line-height: 1.2 !important;
          }
          
          .mobile-header .text-xs {
            font-size: 0.65rem !important;
          }
          
          .mobile-header .text-sm {
            font-size: 0.75rem !important;
          }
          
          .mobile-content {
            margin-top: 13.80rem !important;
            padding-top: 0 !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            margin-left: 2.4rem !important;
            width: calc(100vw - 12.3rem) !important;
            max-width: calc(100vw - 12.3rem) !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }
          
          /* Ensure visit details wrap properly on extra small screens */
          .visit-details-mobile {
            flex-wrap: wrap !important;
          }
          
          .visit-details-mobile > div {
            flex: 0 1 auto !important;
            min-width: fit-content !important;
          }
        }
        
        /* Small mobile (22.125rem to 34.375rem / 354px - 550px) - WITH SIDEBAR */
        @media (min-width: 22.125rem) and (max-width: 34.375rem) {
          .mobile-header {
            left: 12.3rem !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
            margin-left: 0 !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            width: calc(100vw - 12.3rem) !important;
            max-width: calc(100vw - 12.3rem) !important;
            box-sizing: border-box !important;
          }
          
          .mobile-content {
            margin-top: 13.80rem !important;
            padding-top: 0 !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            margin-left: 2.4rem !important;
            width: calc(100vw - 12.3rem) !important;
            max-width: calc(100vw - 12.3rem) !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important;
          }
          
          /* Force all cards to full width without gaps */
          .mobile-content > * {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            box-sizing: border-box !important;
          }
          
          /* Remove horizontal scroll from flex containers */
          .mobile-content .flex,
          .mobile-content .inline-flex {
            flex-wrap: wrap !important;
            overflow-x: hidden !important;
          }
          
          /* Stack typography cleanly - ONLY for mobile */
          .mobile-content h1,
          .mobile-content h2,
          .mobile-content h3,
          .mobile-content h4,
          .mobile-content p,
          .mobile-content span {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
          }
          
          /* Fix consent forms layout on mobile */
          .mobile-content .flex.flex-wrap.gap-6 {
            gap: 1rem !important;
          }
          
          /* Ensure consent badges don't overflow on mobile */
          .mobile-content .inline-flex.items-center.text-white {
            max-width: 90px !important;
            min-width: 85px !important;
            overflow: hidden !important;
            padding: 4px 1rem !important;
            gap: 4px !important;
          }
        }
        
        /* Shared mobile styles (up to 34.375rem / 550px) */
        @media (max-width: 34.375rem) {
          /* Force single column layout on mobile */
          .visits-grid-week {
            display: block !important;
            grid-template-columns: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .visits-grid-week > div {
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
          
          /* Mobile visit details - responsive flex wrap */
          .visit-details-mobile {
            display: flex !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            gap: 0.5rem !important;
          }
          
          .visit-details-mobile > div {
            flex: 0 1 auto !important;
            min-width: fit-content !important;
            max-width: 100% !important;
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
          
          /* Tablet: single column for week view */
          .visits-grid-week {
            display: block !important;
            grid-template-columns: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .visits-grid-week > div {
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
            box-sizing: border-box !important;
          }
          
          /* Control consent badge width on tablet */
          .inline-flex.items-center.text-white {
            max-width: 95px !important;
            min-width: 90px !important;
            padding: 4px 1rem !important;
            gap: 6px !important;
          }
          
          /* Reset text wrapping for tablet - normal behavior */
          .mobile-content h1,
          .mobile-content h2,
          .mobile-content h3,
          .mobile-content h4,
          .mobile-content p,
          .mobile-content span {
            word-wrap: normal !important;
            overflow-wrap: normal !important;
            word-break: normal !important;
          }
        }
        
        /* Desktop: maintain current layout (above 64rem / 1024px) */
        @media (min-width: 64rem) {
          /* Control consent badge width on desktop */
          .inline-flex.items-center.text-white {
            max-width: 100px !important;
            min-width: 95px !important;
            padding: 4px 1rem !important;
            gap: 8px !important;
          }
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
          
          .visits-grid-week {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1rem !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .visits-grid-week > div {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100% !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }
          
          /* Reset text wrapping for desktop - normal behavior */
          .mobile-content h1,
          .mobile-content h2,
          .mobile-content h3,
          .mobile-content h4,
          .mobile-content p,
          .mobile-content span {
            word-wrap: normal !important;
            overflow-wrap: normal !important;
            word-break: normal !important;
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
          <div className="relative flex pb-3 mobile-tabs" style={{ gap: 'clamp(0.188rem, 3vw, 2rem)' }}>
            <button
              ref={todayTabRef}
              onClick={() => setActiveTab('today')}
              className="relative font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base"
              style={{
                color: activeTab === 'today' ? '#015F88' : '#6b7280',
              }}
            >
              Today
            </button>
            <button
              ref={tomorrowTabRef}
              onClick={() => setActiveTab('tomorrow')}
              className="relative font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base"
              style={{
                color: activeTab === 'tomorrow' ? '#015F88' : '#6b7280',
              }}
            >
              Tomorrow
            </button>
            <button
              ref={weekTabRef}
              onClick={() => setActiveTab('week')}
              className="relative font-medium transition-colors duration-200 whitespace-nowrap text-sm sm:text-base"
              style={{
                color: activeTab === 'week' ? '#015F88' : '#6b7280',
              }}
            >
              Week
            </button>

            {/* Animated underline with rounded top corners */}
            <div
              className="absolute bottom-0 transition-all duration-500 ease-in-out z-10"
              style={{
                backgroundColor: '#015F88',
                height: '3px',
                borderRadius: '100px 100px 0 0',
                width: `${underlineStyle.width}px`,
                left: `${underlineStyle.left}px`,
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
                    : activeTab === 'tomorrow'
                      ? 'Equipment Needed Tomorrow'
                      : 'Equipment Needed - Week'}
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
            {activeTab === 'today' ? "Today's Visits" : activeTab === 'tomorrow' ? "Tomorrow's Visits" : 'Upcoming Visits'}
          </h3>
        </div>

        {/* Visit Cards Layout */}
        <div className="space-y-4 sm:space-y-6 w-full visits-section-container" style={{ maxWidth: '100%', overflow: 'hidden', boxSizing: 'border-box' }}>
          {activeTab === 'week' ? (
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

                  {/* Responsive layout for week view - fully responsive */}
                  <div className="w-full bg-white rounded-lg shadow-sm white-container" style={{ maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', padding: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
                    {/* Unified responsive grid - works on both mobile and desktop */}
                    <div className="visits-grid-week" style={{ maxWidth: '100%', width: '100%' }}>
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
                    // Close modal
                    setShowConsentModal(false)

                    // Get visit ID from pending consent data or first visit
                    const visitId = pendingConsentData?.visitId || currentVisits[0]?.id

                    if (visitId) {
                      sessionStorage.setItem('fromConsentPage', 'true')
                      sessionStorage.setItem('currentVisitId', visitId)

                      // Store visit data for later use
                      const visit = currentVisits.find(v => v.id === visitId)
                      if (visit) {
                        sessionStorage.setItem(`visit-${visitId}`, JSON.stringify(visit))
                      }

                      // Open consent form in new tab
                      window.open(`${ROUTES.app.consentForms.href}?visitId=${visitId}`, '_blank')
                    }
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
                    // Close the consent modal
                    setShowConsentModal(false)
                    // Show loading
                    setShowConsentLoading(true)

                    // After 2 seconds, show success
                    setTimeout(() => {
                      setShowConsentLoading(false)
                      setShowConsentSuccess(true)

                      // After 1 second, close success and stay on dashboard
                      setTimeout(() => {
                        setShowConsentSuccess(false)
                        // User stays on visit dashboard - no navigation needed
                      }, 1000)
                    }, 2000)
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