import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'
import { HRADateAnswer } from '@/models/hra/components/hra-answers/hra-date-answer'
import { HRATextAnswer } from '@/models/hra/components/hra-answers/hra-text-answer'
import { HRAMultipleSelectAnswer } from '@/models/hra/components/hra-answers/hra-multiple-select-answer'
import { HRASingleSelectAnswer } from '@/models/hra/components/hra-answers/hra-single-select-answer'
import { HRAYesNoAnswer } from '@/models/hra/components/hra-answers/hra-yes-no-answer'

export * from './hra-date-answer'
export * from './hra-text-answer'
export * from './hra-multiple-select-answer'
export * from './hra-single-select-answer'
export * from './hra-yes-no-answer'

export function getAnswerComponent(question: HRAQuestion) {
  switch (question.answerType) {
    case 'Date':
      return HRADateAnswer
    case 'Text':
      return HRATextAnswer
    case 'Select Multiple':
      return HRAMultipleSelectAnswer
    case 'Select Single':
      return HRASingleSelectAnswer
    case 'Yes/No':
      return HRAYesNoAnswer
    default:
      return null
  }
}
