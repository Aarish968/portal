import { useEffect, useState } from 'react'
import { useBlocker, useNavigate } from 'react-router-dom'
import { Button } from '@/base_submod/components/ui/button'
import { findQuestionByPath, useHRAStore } from '@/models/hra/stores/hra-store'
import type { HRAQuestion } from '@/models/hra/schemas/hra-schema'
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

function HRAView() {
  const [showStartView, setShowStartView] = useState(true)
  const [showReviewView, setShowReviewView] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const navigate = useNavigate()

  const {
    hra,
    isLoading,
    error,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    questionPath,
    editQuestionIndex,
    highestCompletedQuestionIndex,
    setEditQuestionIndex,
    returnToCurrentQuestion,
    resetQuestionState,
  } = useHRAStore()

  const shouldBlock = !showStartView && !showReviewView

  const blocker = useBlocker(shouldBlock)

  useEffect(() => {
    if (!shouldBlock)
      return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      setShowConfirmationModal(true)
      e.returnValue = ''
      return ''
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setShowConfirmationModal(true)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [shouldBlock])

  const handleStartViewContinue = () => {
    resetQuestionState()
    setShowStartView(false)
  }

  const handleConfirmNavigation = () => {
    setShowConfirmationModal(false)
    if (blocker.state === 'blocked') {
      blocker.proceed()
    }
  }

  const handleCancelNavigation = () => {
    setShowConfirmationModal(false)
    if (blocker.state === 'blocked') {
      blocker.reset()
    }
  }

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowConfirmationModal(true)
    }
  }, [blocker.state])

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
    return <div>No HRA data available</div>
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

  const currentQuestion = editQuestionIndex !== null
    ? hra.screening.questions[editQuestionIndex]
    : findQuestionByPath(hra.screening.questions, questionPath)

  if (!currentQuestion) {
    return <div>Question not found</div>
  }

  let displayQuestion = currentQuestion
  if (!currentQuestion.answerType && currentQuestion.children?.length) {
    const childIndex = questionPath[0].childIndex || 0
    const child = currentQuestion.children[childIndex]
    displayQuestion = {
      ...child,
      questionText: `${currentQuestion.questionText}\n\n${child.questionText}`,
    }
  }

  const isLastQuestion = editQuestionIndex !== null
    ? editQuestionIndex === hra.screening.questions.length - 1
    : questionPath[0].questionIndex === hra.screening.questions.length - 1 && questionPath.length === 1

  const canMoveNext = isLastQuestion
    ? hra.answers[displayQuestion.questionId] !== undefined
    : hra.answers[displayQuestion.questionId] !== undefined

  const handleNext = () => {
    if (isLastQuestion && hra.answers[displayQuestion.questionId] !== undefined) {
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
    else if (hra.answers[displayQuestion.questionId] !== undefined) {
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

  const totalQuestions = hra.screening.questions.reduce((total, q) => {
    let count = 1
    if (q.children) {
      count += q.children.reduce((childTotal: number, child: HRAQuestion) => {
        return childTotal + 1 + (child.children?.length || 0)
      }, 0)
    }
    return total + count
  }, 0)

  const currentQuestionNumber = editQuestionIndex !== null
    ? editQuestionIndex + 1
    : questionPath.reduce((total, path, index) => {
      if (index === 0)
        return path.questionIndex + 1
      const parentQuestion = findQuestionByPath(hra.screening.questions, questionPath.slice(0, index))
      return total + (parentQuestion?.children?.[path.questionIndex]?.questionId ? 1 : 0)
    }, 0)

  return (
    <BasePractitionerView>
      <HraProgress
        currentQuestion={currentQuestionNumber}
        totalQuestions={totalQuestions}
      />
      <div className="mx-auto max-w-2xl w-full flex items-center justify-center gap-6">
        <HRAQuestionPreviousButton
          onClick={handlePrevious}
          disabled={editQuestionIndex === 0 || (questionPath.length === 1 && questionPath[0].questionIndex === 0)}
        />
        <HRAQuestionCard
          question={displayQuestion}
          questionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
          answer={hra.answers[displayQuestion.questionId]}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
        <HRAQuestionNextButton
          onClick={handleNext}
          isLastQuestion={isLastQuestion}
          disabled={!canMoveNext}
        />
      </div>
      <HRAViewMenu
        onEdit={() => setIsSheetOpen(true)}
        onStopAndSave={() => setShowConfirmationModal(true)}
      />
      <HRAEditSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        questions={hra.screening.questions}
        onEditQuestion={setEditQuestionIndex}
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
