import { AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/base_submod/hooks/use-toast'
import { Button } from '@/base_submod/components/ui/button'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import HRAStartView from '@/models/hra/views/hra-start-view'
import HRAReviewView from '@/models/hra/views/hra-review-view'
import HraProgress from '@/models/hra/components/hra-progress'
import HRAViewMenu from '@/models/hra/components/hra-view-menu'
import HRAEditSheet from '@/models/hra/components/hra-edit-sheet'
import { Navigate, useBlocker, useNavigate } from 'react-router-dom'
import { useMemberStore } from '@/models/member/stores/member-store'
import HRAConfirmationModal from '@/models/hra/components/hra-confirmation-modal'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import HRAQuestionCard from '@/models/hra/components/hra-questions/hra-question-card'
import HRAQuestionNextButton from '@/models/hra/components/hra-questions/hra-question-next-button'
import HRAQuestionPreviousButton from '@/models/hra/components/hra-questions/hra-question-previous-button'

function HRAView() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showStartView, setShowStartView] = useState(true)
  const [showReviewView, setShowReviewView] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const pendingLocationRef = useRef<any>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [blockNavigation, setBlockNavigation] = useState(false)
  const [direction, setDirection] = useState(1)

  const selectedMember = useMemberStore(state => state.selectedMember)
  const {
    hra,
    error,
    isLoading,
    canMoveNext,
    questionPath,
    nextQuestion,
    answerQuestion,
    isLastQuestion,
    previousQuestion,
    editQuestionIndex,
    getTotalQuestions,
    resetQuestionState,
    getDisplayQuestion,
    setEditQuestionIndex,
    returnToCurrentQuestion,
    getCurrentQuestionNumber,
    highestCompletedQuestionIndex,
  } = useHRAStore()

  useEffect(() => {
    setDirection(1)
  }, [])

  if (!selectedMember) {
    return <Navigate to="/hra-activity" replace />
  }

  const shouldBlock = (!showStartView && (hra !== null || showReviewView)) && !isNavigating

  useEffect(() => {
    setBlockNavigation(shouldBlock)
  }, [shouldBlock])

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (blockNavigation && currentLocation.pathname !== nextLocation.pathname) {
      pendingLocationRef.current = nextLocation
      setShowConfirmationModal(true)
      return true
    }
    return false
  })

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (blockNavigation) {
        e.returnValue = ''
        return ''
      }
    }

    if (blockNavigation) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [blockNavigation])

  const handleExitWithoutSaving = () => {
    setShowConfirmationModal(false)
    setIsNavigating(true)
    setBlockNavigation(false)

    setTimeout(() => {
      blocker.reset?.()
      pendingLocationRef.current = null
      navigate('/hra-activity', { replace: true })
    }, 100)
  }

  const handleConfirmNavigation = () => {
    setShowConfirmationModal(false)
    setIsNavigating(true)
    setBlockNavigation(false)

    toast({
      title: 'Progress Saved',
      duration: 2000,
    })

    setTimeout(() => {
      blocker.reset?.()
      const location = pendingLocationRef.current
      if (location) {
        navigate(location.pathname + location.search + location.hash, {
          replace: true,
        })
      }
      else {
        navigate('/hra-activity')
      }
      pendingLocationRef.current = null
    }, 500)
  }

  const handleCancelNavigation = () => {
    setShowConfirmationModal(false)
    pendingLocationRef.current = null
    blocker.reset?.()
  }

  const handleStartViewContinue = () => {
    resetQuestionState()
    setShowStartView(false)
  }

  if (showStartView) {
    return (
      <HRAStartView
        onContinue={handleStartViewContinue}
        onCancel={() => navigate('/hra-activity')}
      />
    )
  }

  if (isLoading) {
    return <div>Loading HRA...</div>
  }

  if (error) {
    return (
      <div>
        Error:
        {' '}
        {error}
        <Button onClick={() => navigate('/hra-activity')}>Back to HRA Activity</Button>
      </div>
    )
  }

  if (!hra) {
    return <Navigate to="/hra-activity" replace />
  }

  if (showReviewView) {
    return (
      <>
        <HRAReviewView
          hra={hra}
          onSubmit={() => {
            setBlockNavigation(false)
            setIsNavigating(true)
            blocker.reset?.()
          }}
          onBack={() => setShowReviewView(false)}
          onSubmitNavigate={() => {
            navigate('/hra-activity')
          }}
        />
        <HRAConfirmationModal
          isOpen={showConfirmationModal}
          onConfirm={handleConfirmNavigation}
          onCancel={handleCancelNavigation}
          onExitWithoutSaving={handleExitWithoutSaving}
        />
      </>
    )
  }

  const displayQuestion = getDisplayQuestion()

  if (!displayQuestion) {
    return <div>Question not found</div>
  }

  const handleNext = async () => {
    await setDirection(1)
    if (isLastQuestion() && hra?.answers[displayQuestion.questionId] !== undefined) {
      setShowReviewView(true)
      return
    }

    if (editQuestionIndex !== null) {
      if (editQuestionIndex < highestCompletedQuestionIndex) {
        setEditQuestionIndex(editQuestionIndex + 1)
      }
      else {
        returnToCurrentQuestion()
      }
    }
    else if (hra?.answers[displayQuestion.questionId] !== undefined) {
      nextQuestion()
    }
  }

  const handlePrevious = async () => {
    await setDirection(-1)
    if (editQuestionIndex !== null) {
      if (editQuestionIndex > 0) {
        setEditQuestionIndex(editQuestionIndex - 1)
      }
    }
    else {
      previousQuestion()
    }
  }

  const handleAnswer = (questionId: string, answer: string | boolean | string[]) => {
    answerQuestion(questionId, answer)
  }

  return (
    <BasePractitionerView>
      <div className=":uno: w-full flex flex-col gap-6">
        <div className=":uno: flex flex-col items-center justify-center">
          <HraProgress
            currentQuestion={getCurrentQuestionNumber()}
            totalQuestions={getTotalQuestions()}
          />
        </div>
        <div className=":uno: mx-auto flex items-center justify-center gap-6 container">
          <div className=":uno: w-[32px] flex-shrink-0">
            <AnimatePresence mode="wait">
              <HRAQuestionPreviousButton
                key={`prev-${displayQuestion.questionId}`}
                questionId={displayQuestion.questionId}
                onClick={handlePrevious}
                disabled={editQuestionIndex === 0 || (questionPath.length === 1 && questionPath[0].questionIndex === 0)}
              />
            </AnimatePresence>
          </div>

          <div className=":uno: max-w-[640px] w-full">
            <AnimatePresence mode="wait">
              <HRAQuestionCard
                key={displayQuestion.questionId}
                question={displayQuestion}
                answer={hra.answers[displayQuestion.questionId]}
                onAnswer={handleAnswer}
                onNext={handleNext}
                direction={direction}
              />
            </AnimatePresence>
          </div>

          <div className=":uno: w-[92px] flex-shrink-0">
            <AnimatePresence mode="wait">
              <HRAQuestionNextButton
                key={`next-${displayQuestion.questionId}`}
                questionId={displayQuestion.questionId}
                onClick={handleNext}
                isLastQuestion={isLastQuestion()}
                disabled={!canMoveNext()}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
      <HRAViewMenu
        onEdit={() => setIsSheetOpen(true)}
        onStopAndSave={() => {
          pendingLocationRef.current = null
          setShowConfirmationModal(true)
        }}
      />
      <HRAEditSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        questions={hra.screening.questions}
        onEditQuestion={setEditQuestionIndex}
        answers={hra.answers}
      />
      <HRAConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
        onExitWithoutSaving={handleExitWithoutSaving}
      />
    </BasePractitionerView>
  )
}

export default HRAView
