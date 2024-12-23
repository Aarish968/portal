import { useEffect, useRef, useState } from 'react'
import { Navigate, useBlocker, useNavigate } from 'react-router-dom'
import { Button } from '@/base_submod/components/ui/button'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import { useMemberStore } from '@/models/member/stores/member-store'
import HRAStartView from '@/models/hra/views/hra-start-view'
import HRAReviewView from '@/models/hra/views/hra-review-view'
import HraProgress from '@/models/hra/components/hra-progress'
import HRAViewMenu from '@/models/hra/components/hra-view-menu'
import HRAEditSheet from '@/models/hra/components/hra-edit-sheet'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import HRAQuestionCard from '@/models/hra/components/hra-questions/hra-question-card'
import HRAQuestionNextButton from '@/models/hra/components/hra-questions/hra-question-next-button'
import HRAQuestionPreviousButton from '@/models/hra/components/hra-questions/hra-question-previous-button'
import HRAConfirmationModal from '@/models/hra/components/hra-confirmation-modal'
import { useToast } from '@/base_submod/hooks/use-toast'

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

  if (!selectedMember) {
    return <Navigate to="/hra-activity" replace />
  }

  const shouldBlock = !showStartView && !showReviewView && hra !== null && !isNavigating

  useEffect(() => {
    setBlockNavigation(shouldBlock)
  }, [shouldBlock])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (blockNavigation) {
        e.preventDefault()
        return e.preventDefault()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [blockNavigation])

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (blockNavigation && currentLocation.pathname !== nextLocation.pathname) {
      pendingLocationRef.current = nextLocation
      setShowConfirmationModal(true)
      return true
    }
    return false
  })

  const handleConfirmNavigation = () => {
    const location = pendingLocationRef.current
    setBlockNavigation(false)
    setIsNavigating(true)
    setShowConfirmationModal(false)

    toast({
      title: 'Progress Saved',
      duration: 2000,
    })

    setTimeout(() => {
      if (location) {
        navigate(location.pathname + location.search + location.hash, {
          replace: true,
        })
      }
      else {
        navigate('/hra-activity')
      }
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
      <HRAReviewView
        hra={hra}
        onSubmit={() => {}}
        onBack={() => setShowReviewView(false)}
      />
    )
  }

  const displayQuestion = getDisplayQuestion()

  if (!displayQuestion) {
    return <div>Question not found</div>
  }

  const handleNext = () => {
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

  const handlePrevious = () => {
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
      <HraProgress
        currentQuestion={getCurrentQuestionNumber()}
        totalQuestions={getTotalQuestions()}
      />
      <div className=":uno: mx-auto max-w-2xl w-full flex items-center justify-center gap-6">
        <HRAQuestionPreviousButton
          onClick={handlePrevious}
          disabled={editQuestionIndex === 0 || (questionPath.length === 1 && questionPath[0].questionIndex === 0)}
        />
        <HRAQuestionCard
          question={displayQuestion}
          answer={hra.answers[displayQuestion.questionId]}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
        <HRAQuestionNextButton
          onClick={handleNext}
          isLastQuestion={isLastQuestion()}
          disabled={!canMoveNext()}
        />
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
      />
    </BasePractitionerView>
  )
}

export default HRAView
