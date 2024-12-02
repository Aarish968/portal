import { Button } from '@/base_submod/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/base_submod/components/ui/sheet'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'

interface HRAEditSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  questions: HRAQuestion[]
  onEditQuestion: (index: number) => void
}

function HRAEditSheet({ isOpen, onOpenChange, questions, onEditQuestion }: HRAEditSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit HRA Questions</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {questions.map((question, index) => (
            <Button
              key={question.questionId}
              variant="ghost"
              className="h-auto w-full justify-start whitespace-normal py-3 text-left normal-case"
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
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default HRAEditSheet
