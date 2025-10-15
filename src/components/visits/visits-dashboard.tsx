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
    healthRiskAssessment: 'in-progress',
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

function StatusBadge({ status }: { status: Visit['status'] }) {
  const variants = {
    'not-started': {
      className: 'bg-white border border-gray-300 hover:bg-gray-50',
      text: 'Not Started',
    },
    'in-progress': {
      className: 'bg-white border border-gray-300 hover:bg-gray-50',
      text: 'In Progress',
    },
    completed: {
      className: 'bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-1',
      text: 'Completed',
    },
  }
  const variant = variants[status]
  return (
    <div
      className={cn(
        'px-3 sm:px-4 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap',
        variant.className
      )}
      style={{ color: '#1B1B1B' }}
    >
      {status === 'completed' && <Check className="w-3 h-3 flex-shrink-0" />}
      <span className="text-xs">{variant.text}</span>
    </div>
  )
}

function ProcedureBadge({ procedure }: { procedure: VisitProcedure }) {
  if (procedure.completed) {
    return (
      <div className="border border-gray-300 bg-white text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 whitespace-nowrap">
        <Check className="w-3 h-3 flex-shrink-0" />
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

  const getActionButton = () => (
    visit.status === 'completed' ? (
      <Button
        className="rounded-full px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium w-full sm:w-auto sm:min-w-[120px] transition-colors bg-white border border-[#5538A6] text-[#5538A6] hover:bg-gray-50"
        variant="outline"
        onClick={handleVisitClick}
      >
        View Summary
      </Button>
    ) : (
      <Button
        className="text-white rounded-full px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium w-full sm:w-auto sm:min-w-[120px] transition-colors hover:bg-[#4A2F95]"
        style={{ backgroundColor: '#5538A6' }}
        onClick={handleVisitClick}
      >
        Log Outcomes
      </Button>
    )
  )

  const getHRABadge = () => {
    const variants = {
      'not-started': {
        className: 'bg-red-500 text-white',
        text: 'Not Started',
      },
      'in-progress': {
        className: 'bg-orange-500 text-white',
        text: 'In Progress',
      },
      completed: {
        className: 'bg-green-500 text-white flex items-center gap-1',
        text: 'Completed',
      },
    }
    const variant = variants[visit.healthRiskAssessment]
    return (
      <div
        className={cn(
          'px-3 sm:px-4 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 whitespace-nowrap',
          variant.className
        )}
      >
        {visit.healthRiskAssessment === 'completed' && (
          <Check className="w-3 h-3 flex-shrink-0" />
        )}
        <span className="text-xs">{variant.text}</span>
      </div>
    )
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
                  <StatusBadge status={visit.status} />
                </div>
              </div>
              <div className="w-full sm:w-auto sm:flex-shrink-0">{getActionButton()}</div>
            </div>
          </div>

          {/* Visit Details */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 min-w-0" style={{ color: '#939090' }}>
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{visit.time}</span>
              {visit.visitType === 'telehealth' && (
                <div
                  className="ml-1 px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border flex-shrink-0"
                  style={{
                    color: '#239BCF',
                    borderColor: '#239BCF',
                  }}
                >
                  <VideocamIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">Telehealth</span>
                </div>
              )}
            </div>
            {visit.address && visit.visitType !== 'telehealth' && (
              <div className="flex items-center gap-2 min-w-0" style={{ color: '#939090' }}>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm truncate">{visit.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2" style={{ color: '#939090' }}>
              <Building className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">{visit.insurance}</span>
            </div>
          </div>

          {/* Second Telehealth Button (below time for telehealth visits) - only on mobile */}
          {visit.visitType === 'telehealth' && (
            <div className="flex justify-start sm:hidden">
              <div
                className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 border"
                style={{
                  color: '#239BCF',
                  borderColor: '#239BCF',
                  // backgroundColor: '#f0f9ff'
                }}
              >
                <VideocamIcon className="w-3 h-3" />
                Telehealth
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
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {visit.procedures.map((p, i) => (
                <div key={i} className="flex-shrink-0">
                  <ProcedureBadge procedure={p} />
                </div>
              ))}
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
  const dateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const dateSectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const currentVisits = activeTab === 'today' ? visitsToday : mockVisits14Days
  const currentEquipment = activeTab === 'today' ? equipmentDataToday : equipmentData14Days
  const equipmentCount = currentEquipment.reduce((t, e) => t + e.visits, 0)
  const visitCount = currentVisits.length

  const groupedVisits = currentVisits.reduce((acc: Record<string, Visit[]>, v) => {
    const key = v.date || 'Today'
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {})

  // Load persisted state for all visits by id
  useEffect(() => {
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
    const updateTime = () => {
      const now = new Date()
      const options: any = { hour: '2-digit', minute: '2-digit', hour12: true }
      setTime(now.toLocaleTimeString('en-US', options))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  // Scroll detection for making date cards sticky
  const handleScroll = useCallback(() => {
    if (activeTab !== '14days') return

    try {
      const scrollTop = window.scrollY
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
          dateElement.dataset.originalWidth = dateElement.offsetWidth.toString()
          dateElement.dataset.originalHeight = dateElement.offsetHeight.toString()
        }
        const originalWidth = parseInt(dateElement.dataset.originalWidth)
        const originalHeight = parseInt(dateElement.dataset.originalHeight)

        const sectionRect = dateSectionElement.getBoundingClientRect()
        const containerRect = whiteContainer.getBoundingClientRect()
        const sectionTop = sectionRect.top
        const containerBottom = containerRect.bottom

        // Date card should be fixed when:
        // 1. Section has started (sectionTop <= headerHeight)
        // 2. White container bottom hasn't reached the date card bottom position
        const dateCardBottom = headerHeight + originalHeight

        if (sectionTop <= headerHeight && containerBottom > dateCardBottom) {
          // Fixed state - date card is sticky
          dateElement.style.position = 'fixed'
          dateElement.style.top = `${headerHeight}px`
          dateElement.style.left = `${sidebarWidth + 20}px`
          dateElement.style.width = `${originalWidth}px`
          dateElement.style.zIndex = '5'
          dateElement.style.marginBottom = '0'
          // Remove mb-4 class to prevent bottom margin
          dateElement.classList.remove('mb-4')
          // Set wrapper height to maintain space (no extra margin)
          if (wrapper) wrapper.style.height = `${originalHeight}px`
        } else if (containerBottom <= dateCardBottom && containerBottom > headerHeight) {
          // Stopped state - date card moves down with container bottom
          // Keep it fixed but move it down as container scrolls up
          dateElement.style.position = 'fixed'
          dateElement.style.top = `${containerBottom - originalHeight}px`
          dateElement.style.left = `${sidebarWidth + 20}px`
          dateElement.style.width = `${originalWidth}px`
          dateElement.style.zIndex = '5'
          dateElement.style.marginBottom = '0'
          // Remove mb-4 class to prevent bottom margin
          dateElement.classList.remove('mb-0')
          // Keep wrapper height (no extra margin)
          if (wrapper) wrapper.style.height = `${originalHeight}px`
        } else {
          // Normal state - before section starts or after section ends
          dateElement.style.position = ''
          dateElement.style.top = ''
          dateElement.style.left = ''
          dateElement.style.width = ''
          dateElement.style.zIndex = ''
          dateElement.style.marginBottom = ''
          // Restore mb-4 class
          if (!dateElement.classList.contains('mb-0')) {
            dateElement.classList.add('mb-0')
          }
          // Reset wrapper height
          if (wrapper) wrapper.style.height = ''
        }
      })
    } catch (error) {
      console.error('Scroll error:', error)
    }
  }, [activeTab, groupedVisits])

  useEffect(() => {
    if (activeTab === '14days') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', handleScroll)
        // Reset all date card styles when switching tabs
        Object.values(dateRefs.current).forEach(element => {
          if (element) {
            element.style.position = 'sticky'
            element.style.top = 'auto'
            element.style.zIndex = 'auto'
            element.style.width = 'auto'
            element.style.left = 'auto'
            element.style.right = 'auto'
            element.style.maxWidth = 'auto'
            element.style.margin = 'auto'
            element.style.transition = 'none'
          }
        })
      }
    } else {
      // Reset all date card styles when not on 14days tab
      Object.values(dateRefs.current).forEach(element => {
        if (element) {
          element.style.position = 'sticky'
          element.style.top = 'auto'
          element.style.zIndex = 'auto'
          element.style.width = 'auto'
          element.style.left = 'auto'
          element.style.right = 'auto'
          element.style.maxWidth = 'auto'
          element.style.margin = 'auto'
          element.style.transition = 'none'
        }
      })
    }
  }, [activeTab, handleScroll])



  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Custom styles for responsive zoom behavior and mobile fixes */}
      <style>{`
        /* Force mobile header positioning */
        @media (max-width: 639px) {
          .mobile-header {
            left: 191px !important;
            right: 0 !important;
            z-index: 50 !important;
            position: fixed !important;
          }
          
          .mobile-content {
            padding-top: 10rem !important;
            padding-left: 2.5rem !important;
            padding-right: 1rem !important;
            margin-left: 0 !important;
          }
          
          .visit-card-mobile {
            width: 100% !important;
            margin-bottom: 1rem !important;
            display: block !important;
          }
          
          .visits-grid-14days {
            grid-template-columns: 1fr !important;
          }
          
          /* Force single column on mobile */
          .single-column-layout {
            display: block !important;
            width: 100% !important;
          }
        }
        
        /* Desktop responsive behavior - ensure cards stay in position */
        @media (min-width: 640px) {
          .visit-card-container {
            width: 100%;
            max-width: none;
          }
          
          /* Cards stay in position but grow in width on zoom out */
          .single-column-layout {
            max-width: 100% !important;
            width: 100% !important;
            display: block !important;
          }
          
          /* Force all cards to be full width */
          .responsive-grid {
            display: block !important;
            width: 100% !important;
          }
          
          .responsive-grid > div {
            width: 100% !important;
            max-width: 100% !important;
            margin-bottom: 1rem !important;
          }
        }
        
        /* Force single column layout for Today's visits */
        .today-visits-container {
          display: block !important;
          width: 100% !important;
        }
        
        .today-visits-container > div {
          width: 100% !important;
          margin-bottom: 1rem !important;
        }
        
        /* Next 14 Days styling */
        .date-card {
          background-color: rgb(247, 252, 255) !important;
          border: 1px solid rgb(232, 244, 253) !important;
          color: #239BCF !important;
          margin-bottom: 0 !important;
          backdrop-filter: blur(8px) !important;
        }
        

        
        /* 14-day view: responsive grid layout */
        .visits-grid-14days {
          display: grid !important;
          grid-template-columns: 1fr !important;
          gap: 1rem !important;
          width: 100% !important;
        }
        
        @media (min-width: 768px) {
          .visits-grid-14days {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (min-width: 1200px) {
          .visits-grid-14days {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        .visits-grid-14days > div {
          width: 100% !important;
          max-width: 100% !important;
          min-height: 100% !important;
          overflow: hidden !important;
        }
        
        /* Prevent text wrapping in cards */
        .visit-card-content {
          overflow: hidden !important;
        }
        
        .visit-card-content * {
          word-break: normal !important;
          overflow-wrap: normal !important;
        }
        
        /* Today view: full width single column */
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
      `}</style>
      {/* Fixed Header - fully responsive */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 shadow-sm lg:left-49 mobile-header">
        <div className="px-4 sm:px-6 py-4 pb-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-4 sm:mb-0">
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
          <div className="relative flex gap-4 sm:gap-8 pb-3">
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
      <div className="pt-35 px-4 sm:px-6 pb-6 flex-1 overflow-y-auto lg:ml-10 max-w-full mobile-content">
        {/* Equipment Section */}
        <Card
          onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
          className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer transition-all select-none outline-none w-full"
          style={{ minHeight: '56px' }}
        >
          <CardContent className="p-3 sm:p-4 bg-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
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

              <div className="flex items-center gap-2 sm:gap-4">
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