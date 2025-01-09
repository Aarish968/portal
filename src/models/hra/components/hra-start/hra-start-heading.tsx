interface HraStartHeadingProps {
  title: string
  description: string
}

export function HraStartHeading({ title, description }: HraStartHeadingProps) {
  return (
    <div className=":uno: mt-6 text-center text-balance">
      <h1 className=":uno: mb-4 text-32px font-bold">{title}</h1>
      <p className=":uno: mb-8">{description}</p>
    </div>
  )
}
