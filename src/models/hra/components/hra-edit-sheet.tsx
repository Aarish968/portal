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
              key={question.id}
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => {
                onEditQuestion(index)
                onOpenChange(false)
              }}
            >
              <span className="mr-2">
                {index + 1}
                .
              </span>
              {question.text}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default HRAEditSheet
