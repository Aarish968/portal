import { useState } from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/base_submod/hooks/use-toast'
import HRAConfirmBar from '../components/hra-confirm-bar'
import type { HRA } from '@/models/hra/schemas/hra-schema'
import { Button } from '@/base_submod/components/ui/button'
import { HRAReviewTable } from '../components/hra-review/hra-review-table'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'
import { HRAReviewEditButton } from '../components/hra-review/hra-review-edit-button'

interface HRAReviewViewProps {
  hra: HRA
  onSubmit: () => void
  onBack: () => void
  onSubmitNavigate?: () => void
}

function HRAReviewView({ hra, onSubmit, onBack, onSubmitNavigate }: HRAReviewViewProps) {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedAnswers, setEditedAnswers] = useState<Record<string, any>>(hra.answers)
  const { toast } = useToast()
  const navigate = useNavigate()

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
    <BasePractitionerView title="Review and Submit HRA">
      <HRAReviewEditButton
        isEditing={isEditing}
        onClick={() => setIsEditing(!isEditing)}
      />

      <HRAReviewTable
        hra={hra}
        isEditing={isEditing}
        editedAnswers={editedAnswers}
        onAnswerChange={handleAnswerChange}
      />

      <Button
        variant="outline"
        onClick={onBack}
        className=":uno: mt-6"
      >
        Back to Questions
      </Button>

      <HRAConfirmBar
        isConfirmed={isConfirmed}
        onConfirmChange={setIsConfirmed}
        onSubmit={handleSubmit}
        submitText={isEditing ? 'Save Changes' : 'Submit HRA'}
        isEditing={isEditing}
      />
    </BasePractitionerView>
  )
}

export default HRAReviewView
