import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '@/base_submod/hooks/use-toast'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import HRAStartView from '@/models/hra/views/hra-start-view'
import HRAErrorView from '@/models/hra/views/hra-error-view'
import HRAReviewView from '@/models/hra/views/hra-review-view'
import HRASavingView from '@/models/hra/views/hra-saving-view'
import HraProgress from '@/models/hra/components/hra-progress'
import HRAViewMenu from '@/models/hra/components/hra-view-menu'
import HRAEditSheet from '@/models/hra/components/hra-edit-sheet'
import { useHRABlocker } from '@/models/hra/hooks/use-hra-blocker'
import { useMemberStore } from '@/models/member/stores/member-store'
import HRAConfirmationModal from '@/models/hra/components/hra-confirmation-modal'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import HRAQuestionCard from '@/models/hra/components/hra-questions/hra-question-card'
import HRAQuestionNextButton from '@/models/hra/components/hra-questions/hra-question-next-button'
import HRAQuestionPreviousButton from '@/models/hra/components/hra-questions/hra-question-previous-button'
import ROUTES from '@/data/routing/routes'

function HRAView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showStartView, setShowStartView] = useState(true)
  const [showReviewView, setShowReviewView] = useState(false)
  const [direction, setDirection] = useState(1)

  const selectedMemberFromStore = useMemberStore(state => state.selectedMember)
  const setSelectedMember = useMemberStore(state => state.setSelectedMember)

  // Get member from navigation state if available
  const memberFromState = (location.state as any)?.member

  // Use member from state if available, otherwise use from store
  const selectedMember = memberFromState || selectedMemberFromStore

  // If member came from navigation state, update the store
  useEffect(() => {
    if (memberFromState && !selectedMemberFromStore) {
      setSelectedMember(memberFromState)
    }
  }, [memberFromState, selectedMemberFromStore, setSelectedMember])
  const {
    hra,
    error,
    isLoading,
    isSaving,
    canMoveNext,
    questionPath,
    nextQuestion,
    answerQuestion,
    isLastQuestion,
    previousQuestion,
    editQuestionIndex,
    getTotalQuestions,
    getDisplayQuestion,
    setEditQuestionIndex,
    returnToCurrentQuestion,
    getCurrentQuestionNumber,
    highestCompletedQuestionIndex,
  } = useHRAStore()

  useEffect(() => {
    setDirection(1)
  }, [])

  const handleStartViewContinue = () => {
    if (selectedMember?.isCompleted) {
      setShowReviewView(true)
    }
    setShowStartView(false)
  }

  if (!selectedMember) {
    return <Navigate to="/hra-activity" replace />
  }

  const shouldBlock = (!showStartView && (hra !== null || showReviewView))

  const {
    showConfirmationModal,
    handleExitWithoutSaving,
    handleConfirmNavigation,
    handleCancelNavigation,
    setIsNavigating,
    pendingLocationRef,
  } = useHRABlocker({ shouldBlock })

  const handleHRASubmit = async () => {
    try {
      await useHRAStore.getState().saveHRA(true, true)
      toast({
        title: 'HRA Submitted Successfully',
        duration: 2000,
      })
      // Update visit state to mark HRA as completed
      const visitId = selectedMember?.id
      if (visitId) {
        try {
          const stored = localStorage.getItem(`visit-state-${visitId}`)
          if (stored) {
            const visitData = JSON.parse(stored)
            const updatedOutcomes = {
              ...visitData.outcomes,
              'hra': 'completed' as const
            }
            const updatedVisitData = {
              ...visitData,
              outcomes: updatedOutcomes
            }
            localStorage.setItem(`visit-state-${visitId}`, JSON.stringify(updatedVisitData))
          } else {
            // If no visit state exists, create a minimal one with completed HRA
            const newVisitData = {
              id: visitId,
              outcomes: {
                'hra': 'completed' as const
              }
            }
            localStorage.setItem(`visit-state-${visitId}`, JSON.stringify(newVisitData))
          }
        } catch (error) {
          console.error('Failed to update visit state:', error)
        }
      }
      setIsNavigating(true)
      await new Promise(resolve => setTimeout(resolve, 3500))
      // Redirect to Visit Details page if visitId is available, otherwise fallback to HRA Activity
      const redirectPath = visitId 
        ? ROUTES.app.visitDetails.href.replace(':visitId', visitId)
        : '/hra-activity'
      pendingLocationRef.current = { pathname: redirectPath, search: '', hash: '' }
    }
    catch (error) {
      toast({
        title: 'Failed to submit HRA',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
        duration: 3000,
      })
      console.error('Failed to save HRA:', error)
    }
  }

  if (showStartView) {
    return (
      <HRAStartView
        onContinue={handleStartViewContinue}
        onCancel={() => {
          // Redirect to Visit Details page if visitId is available, otherwise fallback to HRA Activity
          const visitId = selectedMember?.id
          const redirectPath = visitId 
            ? ROUTES.app.visitDetails.href.replace(':visitId', visitId)
            : '/hra-activity'
          navigate(redirectPath)
        }}
      />
    )
  }

  if (isLoading || isSaving) {
    return <HRASavingView isSaving={isSaving} />
  }

  if (error) {
    return <HRAErrorView error={error} onBack={() => {
      // Redirect to Visit Details page if visitId is available, otherwise fallback to HRA Activity
      const visitId = selectedMember?.id
      const redirectPath = visitId 
        ? ROUTES.app.visitDetails.href.replace(':visitId', visitId)
        : '/hra-activity'
      navigate(redirectPath)
    }} />
  }

  if (!hra) {
    return <Navigate to="/hra-activity" replace />
  }

  if (showReviewView) {
    return (
      <>
        <HRAReviewView
          hra={hra}
          onSubmit={handleHRASubmit}
          onSubmitNavigate={() => {
            // Redirect to Visit Details page if visitId is available, otherwise fallback to HRA Activity
            const visitId = selectedMember?.id
            const redirectPath = visitId 
              ? ROUTES.app.visitDetails.href.replace(':visitId', visitId)
              : '/hra-activity'
            navigate(redirectPath, { replace: true })
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
      useHRAStore.getState().saveHRA(true, false, true).catch((error) => {
        console.error('Failed to save incremental progress:', error)
      })
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
