import { Icon } from '@iconify/react'
import { ContactForm } from '../components/contact-form'
import ContactInfo from '@/models/support/components/contact-info'
import BasePractitionerView from '@/components/layout/views/base-practitioner-view'

function HeaderIcon() {
  return (
    <div className="flex">
      <div className="flex items-center justify-center rounded-full bg-white p-3">
        <Icon icon="mdi:help-circle" className="h-8 w-8 text-primary" />
      </div>
    </div>
  )
}

function SupportView() {
  const handleSubmit = (_formData: { name: string, email: string, message: string }) => {
  }

  return (
    <BasePractitionerView
      title="We're here to help!"
      description="Please fill out the form or contact us using the information below."
      headerIcon={<HeaderIcon />}
    >
      <ContactInfo />
      <ContactForm onSubmit={handleSubmit} />
    </BasePractitionerView>
  )
}

export default SupportView
