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

interface ContactFormProps {
  onSubmit: (formData: { type: string, message: string }) => void
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ type, message })
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
      <Button type="submit">Send Message</Button>
    </form>
  )
}
