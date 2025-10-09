import React, { useState } from 'react'
import { Clock, MapPin, ChevronDown, Check, Video } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/base_submod/components/ui/tabs'
import { cn } from '@/base_submod/lib/utils'

interface VisitProcedure {
  name: string
  completed?: boolean
}

interface Visit {
  id: string
  patientName: string
  time: string
  address: string
  status: 'not-started' | 'in-progress' | 'completed'
  visitType: 'in-home' | 'telehealth'
  procedures: VisitProcedure[]
  healthRiskAssessment: 'not-started' | 'in-progress' | 'completed'
}

interface DaySection {
  date: string
  visitsCount: number
  visits: Visit[]
}

const mockVisitsData: DaySection[] = [
  {
    date: 'Thursday, August 6, 2025',
    visitsCount: 2,
    visits: [
      {
        id: '1',
        patientName: 'Emily Johnson',
        time: '10:30AM',
        address: '4567 Oak Avenue.',
        status: 'not-started',
        visitType: 'in-home',
        procedures: [
          { name: 'A1C', completed: true },
          { name: 'Blood Pressure', completed: true },
          { name: 'Urine Sample' }
        ],
        healthRiskAssessment: 'not-started'
      },
      {
        id: '2',
        patientName: 'Michael Brown',
        time: '10:30AM',
        address: '7890 Pine Road.',
        status: 'not-started',
        visitType: 'telehealth',
        procedures: [
          { name: 'A1C', completed: true },
          { name: 'Blood Pressure', completed: true },
          { name: 'Urine Sample' }
        ],
        healthRiskAssessment: 'not-started'
      }
    ]
  },
  {
    date: 'Thursday, August 7, 2025',
    visitsCount: 3,
    visits: [
      {
        id: '3',
        patientName: 'Sarah Davis',
        time: '10:30AM',
        address: '1357 Maple Lane.',
        status: 'not-started',
        visitType: 'in-home',
        procedures: [
          { name: 'A1C', completed: true },
          { name: 'Blood Pressure', completed: true },
          { name: 'Urine Sample' }
        ],
        healthRiskAssessment: 'not-started'
      },
      {
        id: '4',
        patientName: 'David Wilson',
        time: '10:30AM',
        address: '2468 Birch Street.',
        status: 'not-started',
        visitType: 'in-home',
        procedures: [
          { name: 'A1C', completed: true },
          { name: 'Blood Pressure', completed: true },
          { name: 'Urine Sample' }
        ],
        healthRiskAssessment: 'not-started'
      },
      {
        id: '5',
        patientName: 'Laura Green',
        time: '10:30AM',
        address: '3690 Cedar Drive.',
        status: 'not-started',
        visitType: 'telehealth',
        procedures: [
          { name: 'A1C', completed: true },
          { name: 'Blood Pressure', completed: true },
          { name: 'Urine Sample' }
        ],
        healthRiskAssessment: 'not-started'
      }
    ]
  },
  {
    date: 'Thursday, August 8, 2025',
    visitsCount: 2,
    visits: [
      {
        id: '6',
        patientName: 'Chris Taylor',
        time: '10:30AM',
        address: '8520 Spruce Way.',
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
        id: '7',
        patientName: 'Jessica White',
        time: '10:30AM',
        address: '1470 Elm Street.',
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
        id: '8',
        patientName: 'Brian King',
        time: '10:30AM',
        address: '2589 Willow Avenue.',
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
        id: '9',
        patientName: 'Samantha Lee',
        time: '10:30AM',
        address: '9631 Ash Boulevard.',
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
        id: '10',
        patientName: 'Kevin Martinez',
        time: '10:30AM',
        address: '7410 Cherry Lane.',
        status: 'not-started',
        visitType: 'in-home',
        procedures: [
          { name: 'A1C' },
          { name: 'Blood Pressure' },
          { name: 'Urine Sample' }
        ],
        healthRiskAssessment: 'not-started'
      }
    ]
  }
]

function StatusBadge({ status }: { status: Visit['status'] }) {
  const variants = {
    'not-started': {
      className: 'border border-[#939090] bg-white text-[#1B1B1B]',
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
    <div className={cn('min-w-4 px-1.5 py-1 rounded-full text-xs font-medium text-center font-[Roboto] tracking-[0.5px] inline-flex items-center justify-center gap-1', variant.className)}>
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
      <div className="bg-[#15827B] text-white min-w-4 px-1.5 py-1 rounded-full text-xs font-medium text-center font-[Roboto] tracking-[0.5px] inline-flex items-center justify-center gap-1">
        <div className="w-4 h-4 min-w-4 max-w-[34px] min-h-4 max-h-[34px] p-1 bg-white rounded-full flex items-center justify-center aspect-square">
          <Check className="w-[18px] h-[18px] text-[#15827B] flex-shrink-0" />
        </div>
        {procedure.name}
      </div>
    )
  }
  
  return (
    <div className="border border-[#939090] bg-white text-[#1B1B1B] min-w-4 px-1.5 py-1 rounded-full text-xs font-medium text-center font-[Roboto] tracking-[0.5px]">
      {procedure.name}
    </div>
  )
}

function VisitTypeBadge({ visitType }: { visitType: Visit['visitType'] }) {
  if (visitType === 'telehealth') {
    return (
      <div className="border border-[#239BCF] bg-white text-[#239BCF] min-w-4 px-0.5 py-0.5 rounded-full text-xs font-medium text-center font-[Roboto] tracking-[0.5px] inline-flex items-center justify-center gap-1">
        <Video className="w-4 h-4 aspect-square" />
        Telehealth
      </div>
    )
  }
  
  return (
    <div className="border border-[#5538A6] bg-white text-[#5538A6] min-w-4 px-0.5 py-0.5 rounded-full text-xs font-medium text-center font-[Roboto] tracking-[0.5px]">
      In-Home Visit
    </div>
  )
}

function VisitCard({ visit }: { visit: Visit }) {
  const getActionButton = () => {
    if (visit.status === 'completed') {
      return (
        <Button className="w-[154px] h-14 justify-center items-center rounded-3xl border border-[#5538A6] bg-[#5538A6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)] text-white font-[Roboto] text-base font-medium leading-6 tracking-[0.15px]">
          View Summary
        </Button>
      )
    }
    
    const buttonText = visit.procedures.some(p => !p.completed) ? 'Start Visit' : 'Log Outcomes'
    
    return (
      <Button className="w-[154px] h-14 justify-center items-center rounded-3xl border border-[#5538A6] bg-[#5538A6] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)] text-white font-[Roboto] text-base font-medium leading-6 tracking-[0.15px]">
        {buttonText}
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
      <div className={cn('min-w-4 px-1.5 py-1 rounded-full text-xs font-medium text-center font-[Roboto] tracking-[0.5px] inline-flex items-center justify-center gap-1', variant.className)}>
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
    <Card className="w-[508px] min-w-70 max-w-[2000px] flex flex-col justify-center items-center gap-5 rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)]">
      <CardContent className="flex p-6 flex-col items-center gap-4 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          {/* Header */}
          <div className="flex justify-center items-center gap-4 self-stretch">
            <div className="flex flex-col items-start gap-3 flex-1">
              <div className="flex items-start gap-3">
                <h3 className="text-[#1B1B1B] font-[Roboto] text-base font-medium leading-6 tracking-[0.15px]">
                  {visit.patientName}
                </h3>
                <div className="flex p-1 flex-col items-start gap-2.5">
                  <StatusBadge status={visit.status} />
                </div>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#939090] aspect-square" />
                  <span className="text-[#939090] font-[Roboto] text-sm font-normal leading-5 tracking-[0.25px]">
                    {visit.time}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#939090] aspect-square" />
                  <span className="text-[#939090] font-[Roboto] text-sm font-normal leading-5 tracking-[0.25px]">
                    {visit.address}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-start gap-2.5">
                <VisitTypeBadge visitType={visit.visitType} />
              </div>
            </div>
            
            {getActionButton()}
          </div>

          {/* Visit Procedures Section */}
          <div className="flex items-start self-stretch border-t border-[#EFEFEF]">
            <div className="flex flex-col items-start gap-4">
              <div className="flex pt-4 pb-2 items-center gap-2 self-stretch">
                <h4 className="text-[#1B1B1B] font-[Roboto] text-xs font-medium leading-4 tracking-[0.5px]">
                  Visit Procedures
                </h4>
              </div>
              <div className="flex items-start">
                {visit.procedures.map((procedure, index) => (
                  <div key={index} className="flex p-1 flex-col items-start gap-2.5">
                    <ProcedureBadge procedure={procedure} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Health Risk Assessment Section */}
          <div className="flex items-start self-stretch border-t border-[#EFEFEF]">
            <div className="flex flex-col items-start gap-4">
              <div className="flex pt-4 pb-2 items-center gap-2 self-stretch">
                <h4 className="text-[#1B1B1B] font-[Roboto] text-xs font-medium leading-4 tracking-[0.5px]">
                  Health Risk Assessment
                </h4>
              </div>
              <div className="flex items-start">
                <div className="flex p-1 flex-col items-start gap-2.5">
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

function DayHeader({ date, visitsCount }: { date: string; visitsCount: number }) {
  return (
    <div className="w-[1061px] min-w-70 max-w-[2000px] flex flex-col justify-center items-center gap-5 rounded-none bg-[#F7FCFF] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)]">
      <div className="flex p-2 px-6 flex-col items-center gap-4 self-stretch">
        <div className="flex flex-col justify-center items-center gap-6 self-stretch">
          <div className="flex p-1 justify-center items-center gap-4 self-stretch border-b border-[#EFEFEF]">
            <div className="flex flex-col justify-center items-start gap-2 flex-1">
              <div className="flex flex-col items-start gap-2 self-stretch">
                <h2 className="text-[#015F88] font-[Roboto] text-base font-medium leading-6 tracking-[0.15px]">
                  {date}
                </h2>
                <div className="flex items-start gap-2.5">
                  <p className="text-[#939090] font-[Roboto] text-base font-medium leading-6 tracking-[0.15px]">
                    {visitsCount} Visits Scheduled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function VisitsDashboardUpdated() {
  const [isEquipmentExpanded, setIsEquipmentExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('14days')

  return (
    <div className="flex w-[1101px] flex-col items-center gap-5">
      {/* Header Card */}
      <Card className="flex p-5 p-t-6 items-center gap-5 self-stretch rounded-t-3xl rounded-b-none bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)]">
        <div className="flex flex-col items-start gap-5">
          <div className="flex flex-col items-start gap-2.5">
            <div className="flex flex-col items-start">
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center items-center gap-2.5">
                  <h1 className="text-[#1B1B1B] font-[Roboto] text-[28px] font-normal leading-9 tracking-0">
                    Visits
                  </h1>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <p className="text-[#939090] font-[Roboto] text-base font-medium leading-6 tracking-[0.15px]">
                  Tuesday, August 5, 2025
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col items-start gap-2.5">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[360px] h-12 flex flex-col items-start rounded-t-2xl rounded-b-none bg-[#F9F9F9]">
              <TabsList className="flex items-start flex-1 self-stretch p-0 bg-transparent">
                <TabsTrigger 
                  value="today" 
                  className={cn(
                    "flex flex-col justify-end items-center flex-1 self-stretch bg-white data-[state=active]:bg-[#F7FCFF] rounded-none",
                    "data-[state=active]:text-[#015F88] data-[state=inactive]:text-[#939090]"
                  )}
                >
                  <div className="flex p-0 px-4 flex-col justify-end items-center flex-1 self-stretch">
                    <div className="flex pt-3.5 pb-3.5 justify-center items-center gap-1 flex-1">
                      <div className="text-center font-[Roboto] text-sm font-medium leading-5 tracking-[0.1px]">
                        Today
                      </div>
                    </div>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="14days" 
                  className={cn(
                    "flex flex-col justify-end items-center flex-1 self-stretch bg-white data-[state=active]:bg-[#F7FCFF] rounded-none relative",
                    "data-[state=active]:text-[#015F88] data-[state=inactive]:text-[#939090]"
                  )}
                >
                  <div className="flex p-0 px-4 flex-col justify-end items-center flex-1 self-stretch">
                    <div className="flex pt-3.5 pb-3.5 justify-center items-center gap-1 flex-1">
                      <div className="text-center font-[Roboto] text-sm font-medium leading-5 tracking-[0.1px]">
                        14 Days
                      </div>
                      {activeTab === '14days' && (
                        <div className="w-[51px] h-3.5 absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          <div className="w-[47px] h-[3px] flex-shrink-0 rounded-t-full bg-[#015F88] absolute left-0.5 bottom-0"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Divider */}
            <div className="flex flex-col justify-center items-start self-stretch">
              <div className="w-[360px] h-px bg-[#C6C6C6]"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Container */}
      <div className="flex flex-col items-center gap-6 self-stretch">
        <div className="flex pt-5 pr-5 pb-2.5 pl-5 flex-col items-start gap-5 self-stretch rounded-3xl bg-[#F8F8F8]">
          {/* Equipment Section */}
          <Card className="w-[1061px] min-w-70 max-w-[2000px] flex flex-col justify-center items-center gap-5 rounded-2xl bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.30),0px_1px_3px_1px_rgba(0,0,0,0.15)]">
            <CardContent className="flex p-3 px-6 flex-col items-center gap-4 self-stretch">
              <div className="flex justify-center items-center gap-4 self-stretch">
                <div className="flex flex-col justify-center items-center gap-6 flex-1">
                  <div className="flex p-1 justify-center items-center gap-4 self-stretch">
                    <div className="flex items-center gap-2 flex-1">
                      <h2 className="text-[#1B1B1B] font-[Roboto] text-base font-medium leading-6 tracking-[0.15px]">
                        Equipment Needed Today
                      </h2>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center items-center gap-6 flex-1">
                  <div className="flex p-1 justify-center items-center gap-4 self-stretch">
                    <div className="flex justify-end items-center gap-2 flex-1">
                      <p className="text-[#939090] font-[Roboto] text-sm font-normal leading-5 tracking-[0.25px]">
                        4 Scheduled - 9 items
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsEquipmentExpanded(!isEquipmentExpanded)}
                  className="w-12 h-12 p-3 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <ChevronDown 
                    className={cn(
                      "w-6 h-6 text-[#939090] transition-transform",
                      isEquipmentExpanded ? "rotate-0" : "rotate-90"
                    )} 
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Visits by Day */}
          <div className="flex flex-col items-start gap-5 self-stretch">
            {mockVisitsData.map((daySection, index) => (
              <div key={index} className="flex flex-col items-start gap-5 self-stretch">
                {/* Day Header */}
                <DayHeader date={daySection.date} visitsCount={daySection.visitsCount} />
                
                {/* Visit Cards Container */}
                <div className="flex items-start content-start gap-5 self-stretch flex-wrap">
                  {daySection.visits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} />
                  ))}
                </div>

                {/* Divider for last day */}
                {index === mockVisitsData.length - 1 && (
                  <div className="flex w-[1061px] justify-center items-center gap-2.5 border-b border-[#939090]">
                    <DayHeader date={daySection.date} visitsCount={daySection.visitsCount} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
