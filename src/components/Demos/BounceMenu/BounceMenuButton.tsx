import { Icon } from '@iconify/react'

interface BounceMenuButtonProps {
  id: string
  title: string
  icon: string
  onMouseEnter: () => void
  isActive: boolean
}

function BounceMenuButton({ id, title, icon, onMouseEnter, isActive }: BounceMenuButtonProps) {
  return (
    <div
      id={id}
      className={`flex items-center px-3 py-2 md:px-4 rounded-xl space-x-2 bg-transparent hover:bg-[#121212] text-[#121212] hover:text-white transition-all duration-250 ${isActive ? '!bg-[#121212] text-white' : ''}`}
      onMouseEnter={onMouseEnter}
    >
      <div>
        <Icon icon={icon} />
      </div>
      <div className="text-sm font-medium">
        {title}
      </div>
    </div>
  )
}

export default BounceMenuButton
