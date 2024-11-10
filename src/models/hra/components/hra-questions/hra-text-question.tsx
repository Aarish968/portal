interface HRATextQuestionProps {
  answer: string
  onAnswer: (answer: string) => void
}

function HRATextQuestion({ answer, onAnswer }: HRATextQuestionProps) {
  return (
    <input
      type="text"
      className="w-full border rounded p-2"
      onChange={e => onAnswer(e.target.value)}
      value={answer || ''}
    />
  )
}

export default HRATextQuestion
