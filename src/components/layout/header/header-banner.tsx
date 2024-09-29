import CallIcon from '@/assets/images/call24icon.svg'
import PorterPhoneNumber from '@/base_submod/components/buttons/porter-phone-number'

interface HeaderBannerProps {
  text?: string
}

function HeaderBanner({ text = 'Call your dedicated care guide at' }: HeaderBannerProps) {
  return (
    <div className=":uno: w-full flex-col-center gap-1 bg-p-500 py-2 text-white leading-24px font-semibold md:flex-row md:gap-4">
      <div className=":uno: flex items-center space-x-2">
        <img src={CallIcon} alt="call_icon" />
        <span className=":uno: text-1rem text-orange-S-200">Need Assistance?</span>
      </div>
      <div className=":uno: flex-col-center gap-2 md:flex-row">
        <span className=":uno: text-center text-balance md:text-start">{text}</span>
        <PorterPhoneNumber />
      </div>
    </div>
  )
}

export default HeaderBanner
