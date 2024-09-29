import { Icon } from '@iconify/react'

interface BounceMenuNotesSubItemProps {
  title: string
  date: string
}

function BounceMenuNotesSubItem({ title, date }: BounceMenuNotesSubItemProps) {
  return (
    <div className="flex items-center justify-between rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:bg-#121212/05 hover:px-4">
      <div className="flex items-center gap-2">
        <Icon icon="ph:paperclip" className="size-4 text-#121212/70" />
        <div className="font-medium">{title}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="text-#121212/90">{date}</div>
        </div>
      </div>
    </div>
  )
}

export default BounceMenuNotesSubItem
