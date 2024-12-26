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
  onExitWithoutSaving: () => void
}

function HRAConfirmationModal({ isOpen, onConfirm, onCancel, onExitWithoutSaving }: HRAConfirmationModalProps) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open && isOpen) {
          onCancel()
        }
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
              onClick={(e) => {
                e.stopPropagation()
                onExitWithoutSaving()
              }}
              className="w-full bg-destructive hover:bg-destructive/90"
            >
              Exit
            </AlertDialogAction>
          </div>
          <div className="w-full">
            <AlertDialogAction
              onClick={(e) => {
                e.stopPropagation()
                onConfirm()
              }}
              className="w-full whitespace-nowrap"
            >
              Save & Exit
            </AlertDialogAction>
          </div>
          <div className="w-full">
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation()
                onCancel()
              }}
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
