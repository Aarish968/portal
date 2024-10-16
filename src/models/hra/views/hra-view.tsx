import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useHRAStore } from '../stores/hra-store'
import HRAStartView from './hra-start-view'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import { Card, CardContent } from '@/base_submod/components/ui/card'
import { Button } from '@/base_submod/components/ui/button'
import HraProgress from '@/models/hra/components/hra-progress'

function HRAView() {
  const [showStartView, setShowStartView] = useState(true)
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

  const activeIndex = editQuestionIndex !== null ? editQuestionIndex : currentQuestionIndex
  const currentQuestion = hra.questions[activeIndex]

  const handleNext = () => {
    if (editQuestionIndex !== null) {
      if (editQuestionIndex < highestCompletedQuestionIndex) {
        setEditQuestionIndex(editQuestionIndex + 1)
      }
      else {
        returnToCurrentQuestion()
      }
    }
    else {
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
        totalQuestions={hra.questions.length}
      />
      <div className="mx-auto max-w-2xl w-full flex items-center justify-center gap-6">
        <div>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeIndex === 0}
            size="icon"
            className="h-9 w-9"
          >
            <Icon icon="ph:caret-left-bold" className="h-4 w-4 shrink-0" />
          </Button>
        </div>
        <Card className="w-full">
          <CardContent className="p-6">
            <p className="mb-6 text-sm text-gray-500">
              Question
              {' '}
              {activeIndex + 1}
              {' '}
              of
              {' '}
              {hra.questions.length}
            </p>
            <div className=":uno: flex flex-col items-center justify-center gap-4">

              <h3 className="mb-4 text-xl font-medium">{currentQuestion.text}</h3>

              {currentQuestion.type === 'multipleChoice' && (
                <div className="space-y-2">
                  {currentQuestion.options?.map(option => (
                    <Button
                      key={option}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => answerQuestion(currentQuestion.id, option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'boolean' && (
                <div className="flex space-x-4">
                  <Button onClick={() => answerQuestion(currentQuestion.id, true)}>Yes</Button>
                  <Button onClick={() => answerQuestion(currentQuestion.id, false)}>No</Button>
                </div>
              )}

              {currentQuestion.type === 'text' && (
                <input
                  type="text"
                  className="w-full border rounded p-2"
                  onChange={e => answerQuestion(currentQuestion.id, e.target.value)}
                  value={hra.answers[currentQuestion.id] as string || ''}
                />
              )}

            </div>
          </CardContent>
        </Card>
        <div>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleNext}
          >
            {activeIndex === hra.questions.length - 1
              ? 'Finish'
              : <Icon icon="ph:caret-right-bold" className="h-4 w-4 shrink-0" />}
          </Button>
        </div>
      </div>
    </BasePractitionerView>
  )
}

export default HRAView
