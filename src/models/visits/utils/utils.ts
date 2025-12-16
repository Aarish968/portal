import { Visit } from '../types/types'

export const cn = (...classes: (string | false | null | undefined)[]) => 
  classes.filter(Boolean).join(' ')

export const groupVisitsByDate = (visits: Visit[]): Record<string, Visit[]> => {
  return visits.reduce((acc: Record<string, Visit[]>, v) => {
    const key = v.date || 'Today'
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {})
}

export const getHeaderHeight = (viewportWidth: number): number => {
  const isVerySmallMobile = viewportWidth <= 389
  const isSmallMobile = viewportWidth >= 390 && viewportWidth <= 638
  
  if (isVerySmallMobile || isSmallMobile) {
    return 220
  }
  return 135
}

// Map lab types to equipment names
const labToEquipmentMap: Record<string, string> = {
  'KED': 'Kidney Function Kit', // For GFR, UACR
  'HbA1c': 'HbA1c Kit',
  'A1C': 'HbA1c Kit',
  'Lipid Panel': 'Lipid Panel Kit',
  'Blood Pressure': 'Blood Pressure Monitor',
  'Urine Sample': 'Urine Collection Kit',
  'Microalbumin': 'Microalbumin Kit',
}

// Map gap types to equipment names
const gapToEquipmentMap: Record<string, string> = {
  'EED': 'Retinal Camera', // For Fundoscopic Imaging
  'Retinal Screening': 'Retinal Camera',
  'EKG': 'Portable ECG/EKG',
  'ECG': 'Portable ECG/EKG',
  'Spirometry': 'Spirometry Kit',
  'Bone Density': 'Bone Density Kit',
  'Vaccine': 'Vaccine Kit',
  'STI': 'STI Kit',
  'HIV': 'HIV Kit',
  'Hepatitis C': 'Hep C Kit',
  'FIT/FOBT': 'FIT/FOBT Kit',
  'Pap/HPV': 'Pap/HPV Kit',
  'Ultrasound': 'Portable Ultrasound',
}

export const generateEquipmentFromVisits = (visits: Visit[]): { name: string; visits: number }[] => {
  const equipmentCount: Record<string, number> = {}
  
  visits.forEach(visit => {
    // Process labs
    if ((visit as any).labs) {
      (visit as any).labs.forEach((lab: any) => {
        const equipmentName = labToEquipmentMap[lab.PSC_Lab_Type__c] || `${lab.PSC_Lab_Type__c} Kit`
        equipmentCount[equipmentName] = (equipmentCount[equipmentName] || 0) + 1
      })
    }
    
    // Process gaps
    if ((visit as any).gaps) {
      (visit as any).gaps.forEach((gap: any) => {
        const equipmentName = gapToEquipmentMap[gap.PSC_Measure__c] || `${gap.PSC_Measure__c} Equipment`
        equipmentCount[equipmentName] = (equipmentCount[equipmentName] || 0) + 1
      })
    }
    
    // Process procedures (fallback for visits without labs/gaps)
    visit.procedures?.forEach(procedure => {
      const equipmentName = labToEquipmentMap[procedure.name] || gapToEquipmentMap[procedure.name]
      if (equipmentName) {
        equipmentCount[equipmentName] = (equipmentCount[equipmentName] || 0) + 1
      }
    })
  })
  
  // Convert to array and sort by visit count (descending)
  return Object.entries(equipmentCount)
    .map(([name, visits]) => ({ name, visits }))
    .sort((a, b) => b.visits - a.visits)
}
