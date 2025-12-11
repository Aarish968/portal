import type { VisitApiResponse, Visit, VisitProcedure, ConsentForm, LabItem, GapItem } from '../types/types'

export interface ProcedureItem {
    id: string
    title: string
    type: 'lab' | 'gap'
    apiId: string
    accountId?: string
    status: string
}

export function mapApiResponseToProcedures(visit: VisitApiResponse): ProcedureItem[] {
    const procedures: ProcedureItem[] = []

    visit.labs?.forEach((lab: LabItem) => {
        const labName = lab.Mapped_Lab_Term && lab.Mapped_Lab_Term.length > 0 
            ? lab.Mapped_Lab_Term.join(', ') 
            : lab.PSC_Lab_Type__c
            
        procedures.push({
            id: lab.PSC_Lab_Type__c.toLowerCase().replace(/\s+/g, '-'),
            title: labName,
            type: 'lab',
            apiId: lab.Id,
            accountId: lab.PSC_Account__c,
            status: lab.PSC_Status__c,
        })
    })

    visit.gaps?.forEach((gap: GapItem) => {
        const gapName = gap.Mapped_Gap_Term || gap.PSC_Measure__c
        
        procedures.push({
            id: `gap-${gap.PSC_Measure__c}`.toLowerCase(),
            title: gapName,
            type: 'gap',
            apiId: gap.Id,
            status: gap.PSC_Status__c,
        })
    })

    return procedures
}

export function transformApiVisitToVisit(apiVisit: VisitApiResponse, index: number): Visit {
    const procedures: VisitProcedure[] = []
    
    // Map labs to procedures
    apiVisit.labs?.forEach((lab: LabItem) => {
        // Use Mapped_Lab_Term if available, otherwise use PSC_Lab_Type__c
        const labName = lab.Mapped_Lab_Term && lab.Mapped_Lab_Term.length > 0 
            ? lab.Mapped_Lab_Term.join(', ') 
            : lab.PSC_Lab_Type__c
        
        procedures.push({
            name: labName,
            completed: lab.PSC_Status__c === 'Completed',
        })
    })

    // Map gaps to procedures
    apiVisit.gaps?.forEach((gap: GapItem) => {
        // Use Mapped_Gap_Term if available, otherwise use PSC_Measure__c
        const gapName = gap.Mapped_Gap_Term || gap.PSC_Measure__c
        
        procedures.push({
            name: gapName,
            completed: gap.PSC_Status__c === 'Completed',
        })
    })

    const consentForms: ConsentForm[] = [
        { name: 'HIPAA Authorization', completed: apiVisit.consentToHipaa },
        { name: 'Notice of Privacy Practices', completed: apiVisit.consentToPrivacy },
        { name: 'Treatment Consent', completed: apiVisit.consentToTreatment },
    ]

    // Determine visit status
    let status: 'not-started' | 'in-progress' | 'completed' | 'ready-to-save' = 'not-started'
    if (apiVisit.IsCompletedFlag) {
        status = 'completed'
    } else if (apiVisit.IsStarted) {
        status = 'in-progress'
    }

    // Format address
    const address = `${apiVisit.memberAddress.street}, ${apiVisit.memberAddress.city}, ${apiVisit.memberAddress.state} ${apiVisit.memberAddress.zip}`

    // Format time using Atlanta timezone and appointmentDatetime if available
    const formatTime = (timeStr: string, appointmentDatetime?: string): string => {
        try {
            // If we have appointmentDatetime, use that for more accurate timezone conversion
            if (appointmentDatetime) {
                const appointmentDate = new Date(appointmentDatetime)
                return appointmentDate.toLocaleTimeString('en-US', {
                    timeZone: 'America/New_York',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                })
            }
            
            // Fallback to original time parsing
            const [hours, minutes] = timeStr.split(':')
            const hour = parseInt(hours, 10)
            const ampm = hour >= 12 ? 'PM' : 'AM'
            const displayHour = hour % 12 || 12
            return `${displayHour}:${minutes}${ampm}`
        } catch {
            return timeStr
        }
    }

    // Format date - check if it's today using Atlanta timezone
    const formatDate = (dateStr: string): string => {
        try {
            // Parse the visit date (assuming it's in YYYY-MM-DD format)
            const visitDate = new Date(dateStr + 'T00:00:00')
            
            // Get current date in Atlanta timezone
            const now = new Date()
            const atlantaToday = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}))
            
            // Create date objects for comparison (set time to midnight to compare only dates)
            const visitDateOnly = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate())
            const todayOnly = new Date(atlantaToday.getFullYear(), atlantaToday.getMonth(), atlantaToday.getDate())
            
            // Calculate difference in days
            const diffTime = visitDateOnly.getTime() - todayOnly.getTime()
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))
            
            if (diffDays === 0) {
                return 'Today'
            } else if (diffDays === 1) {
                return 'Tomorrow'
            } else {
                // Format as readable date for other days
                return visitDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric'
                })
            }
        } catch (error) {
            console.log('Date formatting error:', error, 'for date:', dateStr)
            return dateStr
        }
    }

    return {
        id: apiVisit.caseNumber || `visit-${index + 1}`,
        patientName: `${apiVisit.memberFirstName} ${apiVisit.memberLastName}`,
        time: formatTime(apiVisit.visitTime, apiVisit.appointmentDatetime),
        address,
        phone: apiVisit.MemberPhone,
        insurance: apiVisit.MemberPayer,
        status,
        visitType: apiVisit.visitType.toLowerCase() === 'telehealth' ? 'telehealth' : 'in-home',
        procedures,
        healthRiskAssessment: apiVisit.IsCompletedFlag ? 'completed' : apiVisit.IsStarted ? 'in-progress' : 'not-started',
        consentForms,
        consentURL: apiVisit.consentURL,
        date: formatDate(apiVisit.visitDate),
        // Store original API data for later use
        labs: apiVisit.labs,
        gaps: apiVisit.gaps,
    } as Visit & { labs?: LabItem[], gaps?: GapItem[] }
}
