import { useState } from 'react'
import { Button } from '@/base_submod/components/ui/button'
import { Input } from '@/base_submod/components/ui/input'
import { Textarea } from '@/base_submod/components/ui/textarea'

interface ContactFormProps {
  onSubmit: (formData: { name: string, email: string, message: string }) => void
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, email, message })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm text-gray-700 font-medium">
          Name
        </label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-gray-700 font-medium">
          Email
        </label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-gray-700 font-medium">
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
