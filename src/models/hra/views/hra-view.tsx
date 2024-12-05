import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    questionPath,
    editQuestionIndex,
    highestCompletedQuestionIndex,
    setEditQuestionIndex,
    returnToCurrentQuestion,
    resetQuestionState,
  } = useHRAStore()

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

  const currentQuestion = editQuestionIndex !== null
    ? hra.screening.questions[editQuestionIndex]
    : findQuestionByPath(hra.screening.questions, questionPath)

  if (!currentQuestion) {
    return <div>Question not found</div>
  }

  const isLastQuestion = editQuestionIndex !== null
    ? editQuestionIndex === hra.screening.questions.length - 1
    : questionPath[0].questionIndex === hra.screening.questions.length - 1 && questionPath.length === 1

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
          question={currentQuestion}
          questionNumber={currentQuestionNumber}
          totalQuestions={totalQuestions}
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
