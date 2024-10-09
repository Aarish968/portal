import { ContactForm } from '../components/contact-form'

function SupportView() {
  const handleSubmit = (_formData: { name: string, email: string, message: string }) => {
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Contact Support</h1>
      <p className="mb-4">
        If you need assistance, please fill out the form below and our support team will get back to you as soon as possible.
      </p>
      <ContactForm onSubmit={handleSubmit} />
    </div>
  )
}

export default SupportView
