function ContactInfo() {
  return (
    <div className=":uno: flex flex-col gap-2">
      <div>
        <span className=":uno: font-bold">Phone:</span>
        {' '}
        <a href="tel:8332102877" className=":uno: leading-14px no-underline">1 (833) 210-2877</a>
      </div>
      <div>
        <span className=":uno: font-bold">Email:</span>
        {' '}
        <a href="mailto:support@helloporter.com" className=":uno: leading-14px">support@helloporter.com</a>
      </div>
    </div>
  )
}

export default ContactInfo
