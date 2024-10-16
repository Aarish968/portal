import { Icon } from '@iconify/react'
import { Separator } from '@/base_submod/components/ui/separator'

function SidebarUserInfo() {
  return (
    <div className=":uno: px-3 py-4">
      <Separator className=":uno: bg-primary-p-100 mb-4" />
      <div className=":uno: flex items-center gap-2">
        <div className=":uno: bg-light-purple-50 rounded-full p-2">
          <Icon icon="mdi:user" className=":uno: text-light-purple-300 h-5 w-5" />
        </div>
        <div className=":uno: text-bp-400 flex flex-col gap-.5">
          <span className=":uno: text-12px font-sans font-bold">Amy Porter</span>
          <span className=":uno: text-12px">Nurse Practitioner</span>
        </div>
      </div>
    </div>
  )
}

export default SidebarUserInfo
