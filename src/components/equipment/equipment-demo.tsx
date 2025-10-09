import React from 'react'
import { EquipmentAtAGlance } from './equipment-at-a-glance'

// Sample equipment data for demonstration
const sampleEquipmentItems = [
  { name: 'Blood Pressure Monitor', count: 15 },
  { name: 'Thermometer', count: 8 },
  { name: 'Stethoscope', count: 12 },
  { name: 'Glucose Meter', count: 6 },
  { name: 'Pulse Oximeter', count: 10 },
  { name: 'Scale', count: 4 },
  { name: 'First Aid Kit', count: 3 },
  { name: 'Hand Sanitizer', count: 20 },
  { name: 'Disposable Gloves', count: 50 }
]

export function EquipmentDemo() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Equipment Component Demo</h1>
          <p className="text-gray-600">
            This demonstrates the "Equipment at a Glance" component with different configurations.
          </p>
        </div>

        <div className="space-y-6">
          {/* Default Example */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Default Example</h2>
            <EquipmentAtAGlance />
          </div>

          {/* Custom Data Example */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Custom Equipment Data</h2>
            <EquipmentAtAGlance 
              equipmentItems={sampleEquipmentItems}
              scheduledCount={6}
              totalItems={25}
            />
          </div>

          {/* Smaller Dataset Example */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Smaller Dataset</h2>
            <EquipmentAtAGlance 
              equipmentItems={sampleEquipmentItems.slice(0, 4)}
              scheduledCount={2}
              totalItems={8}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
