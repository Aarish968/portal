import { VisitState, OutcomeValue } from '../types'
import { PROCEDURES, TOTAL_OUTCOMES } from '../constants'

/**
 * Service for calculating visit progress and status
 */
export class VisitProgressService {
  /**
   * Calculate completed procedures count
   */
  static getCompletedCount(outcomes: Record<string, OutcomeValue>): number {
    return Object.values(outcomes).filter(outcome => outcome === 'completed').length
  }

  /**
   * Calculate total outcomes set (completed + not-completed)
   */
  static getTotalOutcomesSet(outcomes: Record<string, OutcomeValue>): number {
    return Object.values(outcomes).filter(
      outcome => outcome === 'completed' || outcome === 'not-completed'
    ).length
  }

  /**
   * Calculate progress percentage
   */
  static getProgressPercentage(outcomes: Record<string, OutcomeValue>): number {
    const totalSet = this.getTotalOutcomesSet(outcomes)
    return Math.min(100, Math.round((totalSet / TOTAL_OUTCOMES) * 100))
  }

  /**
   * Check if all procedures have outcomes
   */
  static areAllProceduresComplete(outcomes: Record<string, OutcomeValue>): boolean {
    return PROCEDURES.every(proc => outcomes[proc.id])
  }

  /**
   * Check if HRA has outcome
   */
  static isHraComplete(outcomes: Record<string, OutcomeValue>): boolean {
    return !!outcomes['hra']
  }

  /**
   * Check if all outcomes are set (procedures + HRA)
   */
  static areAllOutcomesSet(outcomes: Record<string, OutcomeValue>): boolean {
    return this.areAllProceduresComplete(outcomes) && this.isHraComplete(outcomes)
  }

  /**
   * Determine if visit needs saving
   */
  static needsSaving(visitState: VisitState): boolean {
    const { status, outcomes } = visitState
    const allOutcomesSet = this.areAllOutcomesSet(outcomes)

    return (status === 'in-progress' || status === 'ready-to-save') && allOutcomesSet
  }

  /**
   * Get next status based on current state
   */
  static getNextStatus(
    currentStatus: VisitState['status'],
    outcomes: Record<string, OutcomeValue>,
    isInitialLoad: boolean = false
  ): VisitState['status'] {
    if (isInitialLoad) return currentStatus

    const allOutcomesSet = this.areAllOutcomesSet(outcomes)
    const hasAnyOutcome = this.getTotalOutcomesSet(outcomes) > 0

    // If all outcomes are set, move to ready-to-save
    if (allOutcomesSet && (currentStatus === 'not-started' || currentStatus === 'in-progress')) {
      return 'ready-to-save'
    }

    // If any outcome is set and status is not-started, move to in-progress
    if (hasAnyOutcome && currentStatus === 'not-started') {
      return 'in-progress'
    }

    return currentStatus
  }
}