function ContactInfo() {
  return (
    <div className=":uno: flex flex-col gap-2">
      <div>
        <span className=":uno: font-bold">Phone:</span>
        {' '}
        <a href="tel:1234567890" className=":uno: leading-14px">123-456-7890</a>
      </div>
      <div>
        <span className=":uno: font-bold">Email:</span>
        {' '}
        <a href="mailto:support@example.com" className=":uno: leading-14px">support@example.com</a>
      </div>
    </div>
  )
}

export default ContactInfo
