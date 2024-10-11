interface MemberSearchDetailsCardShadedRowProps {
  children: React.ReactNode
}

function MemberSearchDetailsCardShadedRow({ children }: MemberSearchDetailsCardShadedRowProps) {
  return (
    <div className=":uno: grid col-span-2 grid-cols-2 gap-4 border-y bg-gray-soft-border">
      {children}
    </div>
  )
}

export default MemberSearchDetailsCardShadedRow
