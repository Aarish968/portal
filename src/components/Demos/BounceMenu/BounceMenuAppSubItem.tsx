import { Icon } from '@iconify/react'

interface BounceMenuAppSubItemProps {
  icon: string
  title: string
  description: string
}

function BounceMenuAppSubItem({ icon, title, description }: BounceMenuAppSubItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-#121212/05 hover:px-3">
      <Icon icon={icon} className="size-8" />
      <div className="flex flex-col gap-.2">
        <div className="flex items-center space-x-2">
          <div className="font-semibold">{title}</div>
          <Icon icon="ph:arrow-square-out" className="size-4" />
        </div>
        <div className="text-[#121212]/70">{description}</div>
      </div>
    </div>
  )
}

export default BounceMenuAppSubItem
