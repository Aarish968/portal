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
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="h-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Edit HRA Questions</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex-1 overflow-y-auto space-y-2">
          {questions.map((question, index) => {
            const isAnswered = answers[question.questionId] !== undefined
            return (
              <Button
                key={question.questionId}
                variant="ghost"
                className="h-auto w-full justify-start whitespace-normal py-1 text-left normal-case"
                disabled={!isAnswered}
                onClick={() => {
                  onEditQuestion(index)
                  onOpenChange(false)
                }}
              >
                <div className="flex">
                  <span className="mr-2 flex-shrink-0">
                    {index + 1}
                    .
                  </span>
                  <span>{question.questionText}</span>
                </div>
              </Button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default HRAEditSheet
