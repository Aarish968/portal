import type { VisitApiResponse, LabItem, GapItem } from '../types'

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
        procedures.push({
            id: lab.PSC_Lab_Type__c.toLowerCase().replace(/\s+/g, '-'),
            title: lab.PSC_Lab_Type__c,
            type: 'lab',
            apiId: lab.Id,
            accountId: lab.PSC_Account__c,
            status: lab.PSC_Status__c,
        })
    })

    visit.gaps?.forEach((gap: GapItem) => {
        procedures.push({
            id: `gap-${gap.PSC_Measure__c}`.toLowerCase(),
            title: gap.PSC_Measure__c,
            type: 'gap',
            apiId: gap.Id,
            status: gap.PSC_Status__c,
        })
    })

    return procedures
}
