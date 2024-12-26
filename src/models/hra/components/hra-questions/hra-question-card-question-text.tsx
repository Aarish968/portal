interface HRAQuestionCardQuestionTextProps {
  parentQuestionText?: string
  questionText: string
}

function HRAQuestionCardQuestionText({
  parentQuestionText,
  questionText,
}: HRAQuestionCardQuestionTextProps) {
  if (parentQuestionText) {
    return (
      <div className=":uno: w-full text-center text-balance">
        <h3 className=":uno: mb-2 text-xl font-medium">{parentQuestionText}</h3>
        <div className=":uno: mb-6">
          <h4 className=":uno: text-lg">{questionText}</h4>
        </div>
      </div>
    )
  }

  return (
    <h3 className=":uno: mb-4 text-center text-balance text-xl font-medium">{questionText}</h3>
  )
}

export default HRAQuestionCardQuestionText
