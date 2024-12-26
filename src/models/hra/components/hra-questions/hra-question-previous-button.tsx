import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { Button } from '@/base_submod/components/ui/button'

interface HRAQuestionPreviousButtonProps {
  onClick: () => void
  disabled: boolean
  questionId: string
}

function HRAQuestionPreviousButton({ onClick, disabled, questionId }: HRAQuestionPreviousButtonProps) {
  return (
    <motion.div
      key={`prev-${questionId}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.3,
          duration: 0.5,
          ease: 'easeInOut',
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: 'easeInOut',
        },
      }}
    >
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled}
        size="icon"
        className="h-9 w-9 shrink-0"
      >
        <Icon icon="ph:caret-left-bold" className=":uno: mb-1 h-4 w-4 shrink-0" />
      </Button>
    </motion.div>
  )
}

export default HRAQuestionPreviousButton
