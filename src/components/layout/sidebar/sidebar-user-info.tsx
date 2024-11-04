import { Icon } from '@iconify/react'
import { Separator } from '@/base_submod/components/ui/separator'

interface SidebarUserInfoProps {
  name: string
  role?: string
}

function SidebarUserInfo({ name, role = 'Nurse Practitioner' }: SidebarUserInfoProps) {
  return (
    <div className=":uno: px-3 py-4">
      <Separator className=":uno: mb-4 bg-primary-p-100" />
      <div className=":uno: flex items-center gap-2">
        <div className=":uno: rounded-full bg-light-purple-50 p-2">
          <Icon icon="mdi:user" className=":uno: h-5 w-5 text-light-purple-300" />
        </div>
        <div className=":uno: flex flex-col gap-.5 text-bp-400">
          <span className=":uno: text-12px font-sans font-bold">{name}</span>
          <span className=":uno: text-12px">{role}</span>
        </div>
      </div>
    </div>
  )
}

export default SidebarUserInfo
