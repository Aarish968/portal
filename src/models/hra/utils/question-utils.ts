export const DATE_QUESTIONS = [
  'If so, when?',
  'When did you last visit a doctor?',
]

export function isDateQuestion(questionText: string): boolean {
  return DATE_QUESTIONS.includes(questionText)
}

export function formatChoice(choice: string): string {
  return choice === 'NA' ? 'N/A' : choice
}

export function hasLongChoices(choices: string[]): boolean {
  return choices.some(choice => formatChoice(choice).length > 25)
}
