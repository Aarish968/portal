import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { cn } from '@/base_submod/lib/utils'
import './equipment-at-a-glance.scss'

interface EquipmentItem {
  name: string
  count: number
}

export interface EquipmentAtAGlanceProps {
  equipmentItems?: EquipmentItem[]
  scheduledCount?: number
  totalItems?: number
  className?: string
}

const defaultEquipmentItems: EquipmentItem[] = [
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 },
  { name: 'Equipment Example', count: 10 }
]

function EquipmentBadge({ item }: { item: EquipmentItem }) {
  return (
    <div className="equipment-badge">
      <span className="equipment-badge-text">
        {item.name} ({item.count})
      </span>
    </div>
  )
}

export function EquipmentAtAGlance({ 
  equipmentItems = defaultEquipmentItems,
  scheduledCount = 4,
  totalItems = 9,
  className
}: EquipmentAtAGlanceProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className={cn('equipment-container', className)}>
      <CardContent className="equipment-content">
        {/* Header */}
        <div className="equipment-header">
          <div className="equipment-title-section">
            <div className="equipment-title">
              <h2 className="equipment-title-text">Equipment Needed Today</h2>
            </div>
          </div>
          <div className="equipment-count-section">
            <div className="equipment-count">
              <span className="equipment-count-text">
                {scheduledCount} Scheduled - {totalItems} items
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="equipment-chevron-button"
            aria-label={isExpanded ? 'Collapse equipment list' : 'Expand equipment list'}
          >
            <ChevronDown 
              className={cn(
                'equipment-chevron-icon',
                isExpanded ? 'rotate-180' : ''
              )} 
            />
          </button>
        </div>

        {/* Equipment Items */}
        {isExpanded && (
          <div className="equipment-items-container">
            <div className="equipment-grid">
              {equipmentItems.map((item, index) => (
                <EquipmentBadge key={index} item={item} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
