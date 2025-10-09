import { useState } from 'react'
import { Clock, MapPin, Building, ChevronDown, Check, Video } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/base_submod/components/ui/tabs'
import { cn } from '@/base_submod/lib/utils'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/data/routing/routes'

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
  // Only used for 14 days view grouping
  date?: string
}

// Equipment data for Today
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

// Equipment data for Next 14 Days
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

// Visits data for Today
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
      { name: 'Urine Sample' }
    ],
    healthRiskAssessment: 'not-started'
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
      { name: 'Urine Sample' }
    ],
    healthRiskAssessment: 'in-progress'
  }
]

// Visits data for Next 14 Days
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
      { name: 'Spirometry Test' }
    ],
    healthRiskAssessment: 'not-started'
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
      { name: 'FIT/FOBT Test' }
    ],
    healthRiskAssessment: 'not-started'
  },
  {
    id: '3',
    patientName: 'Jane Smith',
    time: '2:30PM',
    address: '369 Poplar Street, Trotwoo...',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 6, 2025',
    procedures: [
      { name: 'FIT/FOBT Test' },
      { name: 'EKG' },
      { name: 'HIV Test' }
    ],
    healthRiskAssessment: 'not-started'
  },
  {
    id: '4',
    patientName: 'Sarah Davis',
    time: '9:30AM',
    address: '1927 Maple Lane',
    insurance: 'Medicare',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 7, 2025',
    procedures: [
      { name: 'A1C' },
      { name: 'Blood Pressure' },
      { name: 'Urine Sample' }
    ],
    healthRiskAssessment: 'not-started'
  },
  {
    id: '5',
    patientName: 'David Wilson',
    time: '10:30AM',
    address: '210 Pine Street',
    insurance: 'UHC',
    status: 'not-started',
    visitType: 'telehealth',
    date: 'Thursday, August 7, 2025',
    procedures: [
      { name: 'A1C' },
      { name: 'Microalbumin Test' },
      { name: 'Urine Sample' }
    ],
    healthRiskAssessment: 'not-started'
  },
  {
    id: '6',
    patientName: 'Laura Green',
    time: '12:00PM',
    address: '90 Pearl Ave',
    insurance: 'BCBS',
    status: 'not-started',
    visitType: 'in-home',
    date: 'Thursday, August 7, 2025',
    procedures: [
      { name: 'A1C' },
      { name: 'Blood Pressure' },
      { name: 'Urine Sample' }
    ],
    healthRiskAssessment: 'not-started'
  }
]

function StatusBadge({ status }: { status: Visit['status'] }) {
  const variants = {
    'not-started': {
      className: 'border border-gray-400 bg-white text-main-black',
      text: 'Not Started'
    },
    'in-progress': {
      className: 'bg-[#CF7C23] text-white',
      text: 'In Progress'
    },
    'completed': {
      className: 'bg-[#15827B] text-white flex items-center gap-1',
      text: 'Completed'
    }
  }

  const variant = variants[status]
  
  return (
    <div className={cn('px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1', variant.className)}>
      {status === 'completed' && (
        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-[#15827B]" />
        </div>
      )}
      {variant.text}
    </div>
  )
}

function ProcedureBadge({ procedure }: { procedure: VisitProcedure }) {
  if (procedure.completed) {
    return (
      <div className="bg-[#15827B] text-white px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-[#15827B]" />
        </div>
        {procedure.name}
      </div>
    )
  }
  
  return (
    <div className="border border-gray-400 bg-white text-main-black px-2 py-1 rounded-full text-xs font-medium">
      {procedure.name}
    </div>
  )
}

function VisitTypeBadge({ visitType }: { visitType: Visit['visitType'] }) {
  if (visitType === 'telehealth') {
    return (
      <div className="border border-[#239BCF] bg-white text-[#239BCF] px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
        <Video className="w-4 h-4" />
        Telehealth
      </div>
    )
  }
  
  return (
    <div className="border border-[#5538A6] bg-white text-[#5538A6] px-2 py-1 rounded-full text-xs font-medium">
      In-Home Visit
    </div>
  )
}

function VisitCard({ visit }: { visit: Visit }) {
  const navigate = useNavigate()

  const handleVisitClick = () => {
    // Navigate to visit details with route param and pass full visit data in state
    navigate(ROUTES.app.visitDetails.href.replace(':visitId', visit.id), { state: { visit } })
  }

  const getActionButton = () => {
    if (visit.status === 'completed') {
      return (
        <Button 
          variant="outline" 
          className="bg-white border-[#5538A6] text-[#5538A6] hover:bg-gray-50 rounded-lg px-4 py-3 h-14 min-w-[154px]"
          onClick={handleVisitClick}
        >
          View Summary
        </Button>
      )
    }
    
    return (
      <Button 
        className="bg-[#5538A6] text-white hover:bg-[#5538A6]/90 rounded-lg px-4 py-3 h-14 min-w-[154px]"
        onClick={handleVisitClick}
      >
        Log Outcomes
      </Button>
    )
  }

  const getHRABadge = () => {
    const variants = {
      'not-started': {
        className: 'bg-[#CF2323] text-white',
        text: 'Not Started'
      },
      'in-progress': {
        className: 'bg-[#CF7C23] text-white',
        text: 'In Progress'
      },
      'completed': {
        className: 'bg-[#15827B] text-white flex items-center gap-1',
        text: 'Completed'
      }
    }

    const variant = variants[visit.healthRiskAssessment]
    
    return (
      <div className={cn('px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1', variant.className)}>
        {visit.healthRiskAssessment === 'completed' && (
          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-[#15827B]" />
          </div>
        )}
        {variant.text}
      </div>
    )
  }

  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <h3 className="text-base font-medium text-[#1B1B1B]">{visit.patientName}</h3>
                <StatusBadge status={visit.status} />
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{visit.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">{visit.address}</span>
                </div>
                <div className="flex items-start gap-1">
                  <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">{visit.insurance}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <VisitTypeBadge visitType={visit.visitType} />
              </div>
            </div>
            
            {getActionButton()}
          </div>

          {/* Visit Procedures Section */}
          <div className="border-t border-[#EFEFEF] pt-4">
            <div className="flex flex-col gap-4">
              <div className="pt-4 pb-2">
                <h4 className="text-xs font-medium text-[#1B1B1B] tracking-[0.5px]">Visit Procedures</h4>
              </div>
              <div className="flex items-start gap-2">
                {visit.procedures.map((procedure, index) => (
                  <div key={index} className="px-1">
                    <ProcedureBadge procedure={procedure} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health Risk Assessment Section */}
          <div className="border-t border-[#EFEFEF] pt-4">
            <div className="flex flex-col gap-4">
              <div className="pt-4 pb-2">
                <h4 className="text-xs font-medium text-[#1B1B1B] tracking-[0.5px]">Health Risk Assessment</h4>
              </div>
              <div className="flex items-start">
                <div className="px-1">
                  {getHRABadge()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function VisitsDashboard() {
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('today')

  // Get data based on active tab
  const currentVisits = activeTab === 'today' ? mockVisitsToday : mockVisits14Days
  const currentEquipment = activeTab === 'today' ? equipmentDataToday : equipmentData14Days
  const equipmentCount = currentEquipment.reduce((total, eq) => total + eq.visits, 0)
  const visitCount = currentVisits.length

  // Group visits by date for 14 days view
  const groupedVisits = currentVisits.reduce((acc: Record<string, Visit[]>, v) => {
    const key = v.date || 'Today'
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {})

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[1101px] mx-auto p-5">
      {/* Header Card */}
      <Card className="w-full rounded-t-lg rounded-b-none shadow-md bg-white">
        <CardHeader className="px-5 py-6 pb-0">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col">
                <div className="flex justify-center items-center gap-2">
                  <div className="flex justify-center items-center gap-2.5">
                    <h1 className="text-[28px] font-normal leading-9 text-[#1B1B1B] font-[Roboto]">
                      Visits
                    </h1>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <p className="text-base font-medium leading-6 text-gray-400 tracking-[0.15px] font-[Roboto]">
                    Tuesday, August 5, 2025
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col items-start gap-2.5">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-[360px]">
                <TabsList className="h-12 flex-col items-start rounded-t-lg bg-[#F9F9F9] p-0">
                  <div className="flex items-start flex-1 self-stretch">
                    <TabsTrigger 
                      value="today" 
                      className="flex-1 self-stretch bg-[#F7FCFF] data-[state=active]:bg-[#F7FCFF] data-[state=active]:text-[#015F88] data-[state=inactive]:bg-white data-[state=inactive]:text-gray-400 rounded-none relative data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-1/2 data-[state=active]:after:-translate-x-1/2 data-[state=active]:after:w-[35px] data-[state=active]:after:h-[3px] data-[state=active]:after:bg-[#015F88] data-[state=active]:after:rounded-t-full"
                    >
                      Today
                    </TabsTrigger>
                    <TabsTrigger 
                      value="14days" 
                      className="flex-1 self-stretch bg-white data-[state=active]:bg-[#F7FCFF] data-[state=active]:text-[#015F88] data-[state=inactive]:bg-white data-[state=inactive]:text-gray-400 rounded-none"
                    >
                      14 Days
                    </TabsTrigger>
                  </div>
                </TabsList>
                
                {/* Divider */}
                <div className="w-full h-px bg-[#C6C6C6]"></div>
              </Tabs>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Container */}
      <div className="flex flex-col items-center gap-6 self-stretch">
        <div className="flex flex-col items-start gap-5 self-stretch rounded-lg bg-[#F8F8F8] p-5 pb-2.5">
          {/* Equipment Section */}
          <Card className="w-full rounded-2xl shadow-md bg-white">
            <CardContent className="p-6 pb-4">
              <div className="flex justify-center items-center gap-4 self-stretch">
                <div className="flex flex-col justify-center items-center gap-6 flex-1">
                  <div className="flex justify-center items-center gap-4 self-stretch p-1">
                    <div className="flex items-center gap-2 flex-1">
                      <h2 className="text-base font-medium leading-6 text-[#1B1B1B] tracking-[0.15px] font-[Roboto]">
                        {activeTab === 'today' ? 'Equipment Needed Today' : 'Upcoming Equipment Needed'}
                      </h2>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-center gap-6 flex-1">
                  <div className="flex justify-center items-center gap-4 self-stretch p-1">
                    <div className="flex justify-end items-center gap-2 flex-1">
                      <p className="text-sm font-normal leading-5 text-gray-400 tracking-[0.25px] font-[Roboto]">
                        {visitCount} visits scheduled • {equipmentCount} items
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
                  className="p-3 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <ChevronDown 
                    className={cn(
                      "w-6 h-6 text-gray-400 transition-transform",
                      isEquipmentExpanded ? "rotate-180" : "rotate-90"
                    )} 
                  />
                </button>
              </div>
              
              {/* Expandable Equipment List */}
              {isEquipmentExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {currentEquipment.map((equipment, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium rounded-full"
                      >
                        {equipment.name} ({equipment.visits} visits)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visit Cards */}
          <div className="flex flex-col items-start gap-5 self-stretch">
            {activeTab === '14days' ? (
              <>
                {Object.entries(groupedVisits).map(([date, visits]) => (
                  <div key={date} className="w-full">
                    <div className="w-full rounded-md bg-[#F0F6FB] px-4 py-2 text-sm text-[#015F88] font-medium">
                      {date}
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
                      {visits.map(v => (
                        <VisitCard key={v.id} visit={v} />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              currentVisits.map((visit) => (
                <VisitCard key={visit.id} visit={visit} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
