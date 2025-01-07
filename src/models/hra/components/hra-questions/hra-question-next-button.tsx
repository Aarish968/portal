import { Icon } from '@iconify/react'
import { motion } from 'motion/react'
import { Button } from '@/base_submod/components/ui/button'
import { useDebounceClick } from '@/hooks/use-debounce-click'

interface HRAQuestionNextButtonProps {
  onClick: () => void
  isLastQuestion: boolean
  disabled: boolean
  questionId: string
}

function HRAQuestionNextButton({ onClick, isLastQuestion, disabled, questionId }: HRAQuestionNextButtonProps) {
  const { handleClick, isDebouncing } = useDebounceClick(onClick)

  return (
    <motion.div
      key={`next-${questionId}`}
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
        size={isLastQuestion ? 'sm' : 'icon'}
        className={isLastQuestion ? 'px-4 py-2 w-full text-center shrink-0' : 'h-9 w-9 shrink-0'}
        onClick={handleClick}
        disabled={disabled || isDebouncing}
      >
        {isLastQuestion
          ? <span className=":uno: items-center pt-1 text-center">Finish</span>
          : <Icon icon="ph:caret-right-bold" className=":uno: mb-1 h-4 w-4 shrink-0" />}
      </Button>
    </motion.div>
  )
}

export default HRAQuestionNextButton
