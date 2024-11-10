import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/base_submod/components/ui/button'
import { useHRAStore } from '@/models/hra/stores/hra-store'
import HRAStartView from '@/models/hra/views/hra-start-view'
import HRAReviewView from '@/models/hra/views/hra-review-view'
import HraProgress from '@/models/hra/components/hra-progress'
import HRAViewMenu from '@/models/hra/components/hra-view-menu'
import HRAEditSheet from '@/models/hra/components/hra-edit-sheet'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import HRAQuestionCard from '@/models/hra/components/hra-questions/hra-question-card'
import HRAQuestionNextButton from '@/models/hra/components/hra-questions/hra-question-next-button'
import HRAQuestionPreviousButton from '@/models/hra/components/hra-questions/hra-question-previous-button'

function HRAView() {
  const [showStartView, setShowStartView] = useState(true)
  const [showReviewView, setShowReviewView] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const navigate = useNavigate()

  const {
    hra,
    isLoading,
    error,
    initializeHRA,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    currentQuestionIndex,
    editQuestionIndex,
    highestCompletedQuestionIndex,
    setEditQuestionIndex,
    returnToCurrentQuestion,
  } = useHRAStore()

  if (showStartView) {
    return (
      <HRAStartView
        onContinue={() => {
          setShowStartView(false)
          initializeHRA()
        }}
        onCancel={() => navigate('/member-search')}
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
        <Button onClick={() => navigate('/member-search')}>Back to Member Search</Button>
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
        onSubmit={() => {
        }}
        onBack={() => setShowReviewView(false)}
      />
    )
  }

  const activeIndex = editQuestionIndex !== null ? editQuestionIndex : currentQuestionIndex
  const currentQuestion = hra.screening.questions[activeIndex]
  const isLastQuestion = activeIndex === hra.screening.questions.length - 1
  const canMoveNext = isLastQuestion
    ? hra.answers[currentQuestion.questionId] !== undefined
    : activeIndex <= highestCompletedQuestionIndex

  const handleNext = () => {
    if (isLastQuestion && hra.answers[currentQuestion.questionId] !== undefined) {
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
    else if (canMoveNext) {
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

  const handleEditQuestion = (index: number) => {
    setEditQuestionIndex(index)
  }

  const handleStopAndSave = () => {
  }

  return (
    <BasePractitionerView>
      <HraProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={hra.screening.questions.length}
      />
      <div className="mx-auto max-w-2xl w-full flex items-center justify-center gap-6">
        <HRAQuestionPreviousButton
          onClick={handlePrevious}
          disabled={activeIndex === 0}
        />
        <HRAQuestionCard
          question={currentQuestion}
          questionNumber={activeIndex + 1}
          totalQuestions={hra.screening.questions.length}
          answer={hra.answers[currentQuestion.questionId]}
          onAnswer={answerQuestion}
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
        onStopAndSave={handleStopAndSave}
      />
      <HRAEditSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        questions={hra.screening.questions}
        onEditQuestion={handleEditQuestion}
      />
    </BasePractitionerView>
  )
}

export default HRAView
