import { ChevronDown } from 'lucide-react'
import { Card, CardContent } from './Card'
import { cn } from '../utils'
import { EquipmentItem, TabType } from '../types'

interface EquipmentSectionProps {
  activeTab: TabType
  currentEquipment: EquipmentItem[]
  visitCount: number
  equipmentCount: number
  isExpanded: boolean
  onToggle: () => void
}

export function EquipmentSection({
  activeTab,
  currentEquipment,
  visitCount,
  equipmentCount,
  isExpanded,
  onToggle
}: EquipmentSectionProps) {
  const getTitle = () => {
    if (activeTab === 'today') return 'Equipment Needed Today'
    if (activeTab === 'tomorrow') return 'Equipment Needed Tomorrow'
    return 'Equipment Needed - Week'
  }

  return (
    <Card
      onClick={onToggle}
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
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              }}
            >
              {getTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 equipment-stats">
            <p className="text-xs text-gray-500 flex-shrink-0">
              {visitCount} visits scheduled • {equipmentCount} items
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            >
              <ChevronDown
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-300',
                  isExpanded ? 'rotate-180' : ''
                )}
              />
            </button>
          </div>
        </div>

        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-in-out',
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
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
  )
}
