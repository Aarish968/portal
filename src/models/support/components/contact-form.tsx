import { useState } from 'react'
import { Button } from '@/base_submod/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/base_submod/components/ui/select'
import { Textarea } from '@/base_submod/components/ui/textarea'
import { useAuthStore } from '@/models/auth/stores/auth-store'
import { useMsal } from '@azure/msal-react'

const API_URL = import.meta.env.VITE_API_URL || ''

interface ContactFormProps {
  onSubmit?: (formData: { type: string, message: string }) => void
}

const typeDisplayMap = {
  feedback: 'Feedback',
  feature: 'Feature Request',
  support: 'Support Issue',
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const { accounts } = useMsal()
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`${API_URL}/support/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await useAuthStore.getState().getAuthHeaders()),
        },
        body: JSON.stringify({
          name: accounts[0]?.name || '',
          email: accounts[0]?.username || '',
          subject: typeDisplayMap[type as keyof typeof typeDisplayMap] || type,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      if (onSubmit) {
        onSubmit({ type, message })
      }

      setType('')
      setMessage('')
    }
    catch (error) {
      console.error('Error sending message:', error)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className=":uno: space-y-4">
      <div>
        <label htmlFor="type" className=":uno: block text-sm text-gray-700 font-medium">
          Type
        </label>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="feature">Feature Request</SelectItem>
            <SelectItem value="support">Support Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="message" className=":uno: block text-sm text-gray-700 font-medium">
          Message
        </label>
        <Textarea
          id="message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </Button>
    </form>
  )
}
