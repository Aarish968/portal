export function formatChoice(choice: string): string {
  return choice === 'NA' ? 'N/A' : choice
}

export function hasLongChoices(choices: string[]): boolean {
  return choices.some(choice => formatChoice(choice).length > 25)
}
