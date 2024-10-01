import { Link } from 'react-router-dom'
import CaregiverUserIcon from '@/base_submod/assets/images/icons/caregiver-user-icon.svg'
import PorterLogo from '@/base_submod/components/misc/porter-logo'

import {
  NavigationMenu,
  NavigationMenuItem,
  navigationMenuTriggerStyle,
} from '@/base_submod/components/ui/navigation-menu'

function HeaderMain() {
  return (
    <div className=":uno: border-b border-#F3F0FB bg-white text-main-black">
      <NavigationMenu className=":uno: page-width flex items-center py-3 !w-full !justify-between page-px">
        <div className=":uno: flex items-center space-x-4">
          <NavigationMenuItem className=":uno: flex list-none items-center">
            <Link to="/" className={`:uno: flex items-center ${navigationMenuTriggerStyle()}`}>
              <PorterLogo variant="dark" />
            </Link>
          </NavigationMenuItem>

        </div>
        <div className=":uno: flex items-center space-x-2">
          <img src={CaregiverUserIcon} className=":uno: size-6 !text-red" />
          <div className=":uno: text-center font-sans font-medium">Hi Jordan</div>

        </div>

      </NavigationMenu>
    </div>
  )
}

export default HeaderMain
