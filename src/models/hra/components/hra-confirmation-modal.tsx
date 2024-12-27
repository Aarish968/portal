import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/base_submod/components/ui/alert-dialog'
import { useRef } from 'react'

interface HRAConfirmationModalProps {
  isOpen: boolean
  onConfirm: (e?: React.MouseEvent) => void
  onCancel: (e?: React.MouseEvent) => void
  onExitWithoutSaving: (e?: React.MouseEvent) => void
}

function HRAConfirmationModal({ isOpen, onConfirm, onCancel, onExitWithoutSaving }: HRAConfirmationModalProps) {
  const isConfirmingRef = useRef(false)

  const handleConfirm = (e: React.MouseEvent) => {
    isConfirmingRef.current = true
    onConfirm(e)
  }

  const handleExitWithoutSaving = (e: React.MouseEvent) => {
    isConfirmingRef.current = true
    onExitWithoutSaving(e)
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open && isOpen && !isConfirmingRef.current) {
          onCancel()
        }
        isConfirmingRef.current = false
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Exit HRA Assessment?</AlertDialogTitle>
          <AlertDialogDescription>
            Choose how you would like to exit:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col gap-2">
          <div className="w-full">
            <AlertDialogAction
              onClick={handleExitWithoutSaving}
              className="w-full bg-destructive hover:bg-destructive/90"
            >
              Exit
            </AlertDialogAction>
          </div>
          <div className="w-full">
            <AlertDialogAction
              onClick={handleConfirm}
              className="w-full whitespace-nowrap"
            >
              Save & Exit
            </AlertDialogAction>
          </div>
          <div className="w-full">
            <AlertDialogCancel
              onClick={onCancel}
              className="w-full whitespace-nowrap"
            >
              Continue HRA
            </AlertDialogCancel>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default HRAConfirmationModal
