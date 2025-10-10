import { useEffect, useState } from 'react'
import { Clock, MapPin, Building, Check, Video, ChevronDown, Bell } from 'lucide-react'

// Simple Card components (replacing shadcn/ui for demo)
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg ${className}`}>{children}</div>
)

const CardContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
)

const Button = ({ children, className = '', style, onClick, variant = 'default' }) => {
  const baseClass = 'rounded-md px-4 py-2 text-sm font-medium transition-colors'
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

const cn = (...classes) => classes.filter(Boolean).join(' ')

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
    patientName: 'Brandon Young',
    time: '1:00PM',
    address: '147 Willow Court, Englewo...',
    insurance: 'BCBS',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 8, 2025',
    procedures: [
      { name: 'EKG' },
      { name: 'Hepatitis C Test' },
      { name: 'HIV Test' },
      { name: 'FIT/FOBT Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
  {
    id: '4',
    patientName: 'Brandon Young',
    time: '1:00PM',
    address: '147 Willow Court, Englewo...',
    insurance: 'BCBS',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 7, 2025',
    procedures: [
      { name: 'EKG' },
      { name: 'Hepatitis C Test' },
      { name: 'HIV Test' },
      { name: 'FIT/FOBT Test' },
    ],
    healthRiskAssessment: 'not-started',
  },
]

function StatusBadge({ status }: { status: Visit['status'] }) {
  const variants = {
    'not-started': {
      className: 'bg-red-500 text-white hover:bg-red-600',
      text: 'Not Started',
    },
    'in-progress': {
      className: 'bg-orange-500 text-white hover:bg-orange-600',
      text: 'In Progress',
    },
    completed: {
      className: 'bg-green-500 text-white hover:bg-green-600 flex items-center gap-1',
      text: 'Completed',
    },
  }
  const variant = variants[status]
  return (
    <div
      className={cn(
        'px-3 py-1 rounded text-xs font-medium inline-flex items-center gap-1 transition-colors cursor-pointer',
        variant.className
      )}
    >
      {status === 'completed' && <Check className="w-3 h-3" />}
      {variant.text}
    </div>
  )
}

function ProcedureBadge({ procedure }: { procedure: VisitProcedure }) {
  if (procedure.completed) {
    return (
      <div className="border border-gray-300 bg-white text-gray-700 px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1">
        <Check className="w-3 h-3" />
        {procedure.name}
      </div>
    )
  }
  return (
    <div className="border border-gray-300 bg-white text-gray-700 px-2 py-1 rounded text-xs font-medium">
      {procedure.name}
    </div>
  )
}

function VisitTypeBadge({ visitType }: { visitType: Visit['visitType'] }) {
  if (visitType === 'telehealth') {
    return (
      <div
        className="bg-white px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 border"
        style={{ color: '#239BCF', borderColor: '#239BCF' }}
      >
        <Video className="w-3 h-3" />
        Telehealth
      </div>
    )
  }
  return (
    <div
      className="bg-white px-3 py-1 rounded-lg text-xs font-medium inline-flex items-center gap-1 border"
      style={{ color: '#5538A6', borderColor: '#5538A6' }}
    >
      In-Home Visit
    </div>
  )
}

function VisitCard({ visit }: { visit: Visit }) {
  const handleVisitClick = () => console.log('Visit clicked:', visit.id)
  const getActionButton = () => (
    <Button
      className="text-white hover:bg-gray-600 rounded-md px-4 py-2 text-sm font-medium min-w-[120px] transition-colors"
      style={{ backgroundColor: '#5538A6' }}
      onClick={handleVisitClick}
    >
      Log Outcomes
    </Button>
  )
  const getHRABadge = () => {
    const variants = {
      'not-started': {
        className:
          'bg-red-500 text-white animate-pulse hover:bg-red-300 transition-colors duration-1000',
        text: 'Not Started',
      },
      'in-progress': {
        className: 'border border-gray-300 bg-white text-gray-700',
        text: 'In Progress',
      },
      completed: {
        className: 'border border-gray-300 bg-white text-gray-700 flex items-center gap-1',
        text: 'Completed',
      },
    }
    const variant = variants[visit.healthRiskAssessment]
    return (
      <div
        className={cn(
          'px-3 py-1 rounded text-xs font-medium inline-flex items-center gap-1',
          variant.className
        )}
      >
        {visit.healthRiskAssessment === 'completed' && (
          <Check className="w-3 h-3" />
        )}
        {variant.text}
      </div>
    )
  }

  return (
    <Card className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="text-lg font-medium" style={{ color: '#1b1b1b' }}>
                {visit.patientName}
              </h3>
              <StatusBadge status={visit.status} />
            </div>
            <div className="flex-shrink-0">{getActionButton()}</div>
          </div>

          {/* Visit Details */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2" style={{ color: '#939090' }}>
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>{visit.time}</span>
            </div>
            {visit.address && (
              <div className="flex items-center gap-2" style={{ color: '#939090' }}>
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{visit.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2" style={{ color: '#939090' }}>
              <Building className="w-4 h-4 flex-shrink-0" />
              <span>{visit.insurance}</span>
            </div>
          </div>

          {/* Visit Type */}
          <VisitTypeBadge visitType={visit.visitType} />

          {/* Procedures */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Applied Procedures
            </h4>
            <div className="flex flex-wrap gap-2">
              {visit.procedures.map((p, i) => (
                <ProcedureBadge key={i} procedure={p} />
              ))}
            </div>
          </div>

          {/* Health Risk Assessment */}
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wide">
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
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false)
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York',
      }
      setTime(now.toLocaleTimeString('en-US', options))
    }
    updateTime()
    const timer = setInterval(updateTime, 60000)
    return () => clearInterval(timer)
  }, [])

  const currentVisits = activeTab === 'today' ? mockVisitsToday : mockVisits14Days
  const currentEquipment =
    activeTab === 'today' ? equipmentDataToday : equipmentData14Days
  const equipmentCount = currentEquipment.reduce((t, e) => t + e.visits, 0)
  const visitCount = currentVisits.length

  const groupedVisits = currentVisits.reduce((acc: Record<string, Visit[]>, v) => {
    const key = v.date || 'Today'
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {})

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-15 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-medium" style={{ color: '#1b1b1b' }}>
                Visit Outcomes
              </h1>
              <p className="text-sm mt-1" style={{ color: '#939090' }}>
                Friday, October 10, 2025
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400">Current Time</span>
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-gray-400" />
                <span className="text-sm font-semibold text-black">{time}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('today')}
                className={cn(
                  'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'today'
                    ? 'text-[#239BCF]'
                    : 'border-transparent text-gray-500 hover:text-[#239BCF]'
                )}
                style={activeTab === 'today' ? { borderColor: '#239BCF' } : {}}
              >
                Today
              </button>
              <button
                onClick={() => setActiveTab('14days')}
                className={cn(
                  'py-3 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === '14days'
                    ? 'text-[#239BCF]'
                    : 'border-transparent text-gray-500 hover:text-[#239BCF]'
                )}
                style={activeTab === '14days' ? { borderColor: '#239BCF' } : {}}
              >
                Next 14 Days
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-15 pt-6 pb-6">
          {/* Equipment Section */}
          <Card className="mb-8 bg-white border rounded-lg shadow-sm" style={{ borderColor: '#239BCF' }}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg font-medium" style={{ color: '#1b1b1b' }}>
                    {activeTab === 'today' ? 'Equipment Needed Today' : 'Equipment Needed - Next 14 Days'}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    {visitCount} visits scheduled • {equipmentCount} items
                  </p>
                  <button
                    onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-gray-400 transition-transform',
                        isEquipmentExpanded ? 'rotate-180' : ''
                      )}
                    />
                  </button>
                </div>
              </div>

              {isEquipmentExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentEquipment.map((eq, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {eq.name}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                          {eq.visits}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Visits Section */}
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-0" style={{ color: '#1b1b1b' }}>
              {activeTab === 'today' ? "Today's Visits" : "Upcoming Visits"}
            </h3>
          </div>

          {/* Visit Cards Layout */}
          <div className={activeTab === '14days' ? 'space-y-6' : 'space-y-6'}>
            {activeTab === '14days' ? (
              <>
                {Object.entries(groupedVisits).map(([date, visits]) => (
                  <div key={date} className="space-y-4">
                    <div className="bg-gray-100 border border-gray-200 rounded-lg px-4 py-3">
                      <h4 className="text-sm font-medium text-gray-700">{date}</h4>
                    </div>
                    {/* Single row layout for 14 days view */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin px-1">
                      {visits.map(v => (
                        <div key={v.id} className="flex-shrink-0 w-80 min-w-80">
                          <VisitCard visit={v} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              /* Single column layout for today's visits */
              <div className="space-y-4">
                {currentVisits.map((visit) => (
                  <VisitCard key={visit.id} visit={visit} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}