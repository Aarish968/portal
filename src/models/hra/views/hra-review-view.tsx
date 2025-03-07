import { useState } from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/base_submod/hooks/use-toast'
import HRAConfirmBar from '../components/hra-confirm-bar'
import type { HRA } from '@/models/hra/schemas/hra-schema'
import { HRAReviewTable } from '../components/hra-review/hra-review-table'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import { HRAReviewEditButton } from '../components/hra-review/hra-review-edit-button'
import { transformHRAData } from '../utils/hra-store-utils'
import { useMemberStore } from '@/models/member/stores/member-store'

interface HRAReviewViewProps {
  hra: HRA
  onSubmit: () => void
  onSubmitNavigate?: () => void
}

function HRAReviewView({ hra, onSubmit, onSubmitNavigate }: HRAReviewViewProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedAnswers, setEditedAnswers] = useState<Record<string, any>>(hra.answers)
  const [hasUnansweredQuestions, setHasUnansweredQuestions] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const isDev = import.meta.env.VITE_DEV_TEST === 'true'
  const selectedMember = useMemberStore(state => state.selectedMember)
  const isCompleted = selectedMember?.isCompleted

  const handleAnswerChange = (questionId: string, value: string | string[] | boolean) => {
    setEditedAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = () => {
    if (isEditing) {
      hra.answers = editedAnswers
      setIsEditing(false)
      toast({
        title: 'Changes Saved',
        duration: 2000,
        icon: <Check className=":uno: h-4 w-4 text-green-500" />,
      })
      return
    }

    toast({
      title: 'HRA Submitted',
      duration: 2000,
      icon: <Check className=":uno: h-4 w-4 text-green-500" />,
    })

    onSubmit()

    setTimeout(() => {
      if (onSubmitNavigate) {
        onSubmitNavigate()
      }
      else {
        navigate('/hra-activity')
      }
    }, 100)
  }

  return (
    <BasePractitionerView title={isCompleted ? 'Review Completed HRA' : 'Review and Submit HRA'}>
      <div className=":uno: max-w-[975px] xl:max-w-none">
        <div className=":uno: flex flex-col gap-1">
          {!isCompleted && (
            <HRAReviewEditButton
              isEditing={isEditing}
              onClick={() => setIsEditing(!isEditing)}
            />
          )}

          <HRAReviewTable
            hra={hra}
            isEditing={isEditing && !isCompleted}
            editedAnswers={editedAnswers}
            onAnswerChange={handleAnswerChange}
            onUnansweredQuestionsChange={count => setHasUnansweredQuestions(count > 0)}
            isCompleted={isCompleted}
            isReview={true}
          />
        </div>

        {isDev && (
          <>
            <div className=":uno: mt-6 border rounded-lg p-4">
              <div className=":uno: mb-2 text-sm font-medium">Debug: Raw HRA Data</div>
              <pre className=":uno: max-h-96 overflow-auto rounded bg-gray-50 p-4 text-xs">
                {JSON.stringify(hra, null, 2)}
              </pre>
            </div>

            <div className=":uno: mt-6 border rounded-lg p-4">
              <div className=":uno: mb-2 text-sm font-medium">Debug: Transformed HRA Data</div>
              <pre className=":uno: max-h-96 overflow-auto rounded bg-gray-50 p-4 text-xs">
                {JSON.stringify(transformHRAData(hra), null, 2)}
              </pre>
            </div>

          </>
        )}
      </div>

      <HRAConfirmBar
        isConfirmed={isConfirmed}
        onConfirmChange={setIsConfirmed}
        onSubmit={handleSubmit}
        submitText={isEditing ? 'Save Changes' : 'Submit HRA'}
        isEditing={isEditing}
        disabled={!isEditing && hasUnansweredQuestions}
        isCompleted={isCompleted}
        onReturn={() => navigate('/hra-activity')}
      />

    </BasePractitionerView>
  )
}

export default HRAReviewView
