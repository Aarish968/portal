import { ContactForm } from '../components/contact-form'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'

function SupportView() {
  const handleSubmit = (_formData: { name: string, email: string, message: string }) => {
  }

  return (
    <BasePractitionerView title="Contact Support" description="If you need assistance, please fill out the form below and our support team will get back to you as soon as possible.">
      <ContactForm onSubmit={handleSubmit} />
    </BasePractitionerView>
  )
}

export default SupportView
