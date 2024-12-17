import { Button } from '@/base_submod/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/base_submod/components/ui/sheet'
import type { HRA, HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRAEditSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  questions: HRAQuestion[]
  onEditQuestion: (index: number) => void
  answers: HRA['answers']
}

function HRAEditSheet({ isOpen, onOpenChange, questions, onEditQuestion, answers }: HRAEditSheetProps) {
  const renderQuestion = (question: HRAQuestion, index: number, isChild = false) => {
    const isAnswered = answers[question.questionId] !== undefined
    const answer = answers[question.questionId]
    const answerStr = Array.isArray(answer) ? answer[0] : String(answer)

    const hasChildren = question.children?.length > 0
    const showChildren = hasChildren && (
      !question.answerType
      || question.children.some((child: HRAQuestion) => child.childDependentValue === answerStr)
    )

    return (
      <div key={question.questionId}>
        <Button
          variant="ghost"
          className={`h-auto w-full justify-start whitespace-normal py-1 text-left normal-case ${
            isChild ? 'pl-8' : ''
          }`}
          disabled={!isAnswered}
          onClick={() => {
            onEditQuestion(index)
            onOpenChange(false)
          }}
        >
          <div className="flex">
            <span className="mr-2 flex-shrink-0">
              {isChild ? String.fromCharCode(97 + index) : index + 1}
              .
            </span>
            <span>{question.questionText}</span>
          </div>
        </Button>

        {showChildren && question.children?.map((child: HRAQuestion, childIndex: number) => {
          if (!question.answerType || child.childDependentValue === answerStr) {
            return renderQuestion(child, childIndex, true)
          }
          return null
        })}
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit HRA Questions</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          {questions.map((question, index) => renderQuestion(question, index))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default HRAEditSheet
