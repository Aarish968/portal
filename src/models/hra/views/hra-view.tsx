import { useEffect, useState } from 'react'
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
    answerQuestion,
    nextQuestion,
    previousQuestion,
    currentQuestionIndex,
    editQuestionIndex,
    highestCompletedQuestionIndex,
    setEditQuestionIndex,
    returnToCurrentQuestion,
    resetQuestionState,
  } = useHRAStore()

  // Handle view transitions
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

  const activeIndex = editQuestionIndex !== null ? editQuestionIndex : currentQuestionIndex
  const currentQuestion = hra.screening.questions[activeIndex]
  const isLastQuestion = activeIndex === hra.screening.questions.length - 1
  const canMoveNext = isLastQuestion
    ? hra.answers[currentQuestion.questionId] !== undefined
    : hra.answers[currentQuestion.questionId] !== undefined

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
    else if (hra.answers[currentQuestion.questionId] !== undefined) {
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
        onStopAndSave={() => {}}
      />
      <HRAEditSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        questions={hra.screening.questions}
        onEditQuestion={setEditQuestionIndex}
      />
    </BasePractitionerView>
  )
}

export default HRAView
