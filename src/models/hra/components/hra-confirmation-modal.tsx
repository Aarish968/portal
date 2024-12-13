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

interface HRAConfirmationModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

function HRAConfirmationModal({ isOpen, onConfirm, onCancel }: HRAConfirmationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open: boolean) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pause HRA Assessment?</AlertDialogTitle>
          <AlertDialogDescription>
            Your progress will be saved and you can continue later. Are you sure you want to exit?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div>
            <AlertDialogCancel onClick={onCancel}>Continue Assessment</AlertDialogCancel>
          </div>
          <div>
            <AlertDialogAction onClick={onConfirm}>Save & Exit</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default HRAConfirmationModal
