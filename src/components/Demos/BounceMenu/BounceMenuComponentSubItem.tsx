import { Icon } from '@iconify/react'

interface BounceMenuComponentSubItemProps {
  title: string
  type: string
  date: string
}

function BounceMenuComponentSubItem({ title, type, date }: BounceMenuComponentSubItemProps) {
  const splitDate = date.split('/')
  return (
    <div className="flex items-center justify-between rounded-md px-3 py-2 transition-all duration-300 ease-in-out hover:bg-#121212/05 hover:px-4">
      <div className="flex items-center gap-2">
        <Icon icon="ph:code" className="size-4 text-#121212/70" />
        <div className="font-medium">{title}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="border border-#121212/40 rounded-md p-2px px-2 text-#121212/40">{type}</div>
        <div className="flex items-center gap-1">
          <div className="text-#121212/90">{splitDate[0]}</div>
          <div>·</div>
          <div className="text-#121212/90">{splitDate[1]}</div>
        </div>
      </div>
    </div>
  )
}

export default BounceMenuComponentSubItem
