import { Link } from 'react-router-dom'
import UserIcon from '@/assets/images/user_icon.svg'
import PorterLogo from '@/base_submod/components/Misc/porter-logo'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/base_submod/components/ui/navigation-menu'

function HeaderMain() {
  return (
    <div className=":uno: bg-primary text-white">
      <NavigationMenu className=":uno: page-width flex items-center py-3 !w-full !justify-between page-px">
        <div className=":uno: flex items-center space-x-4">
          <NavigationMenuItem className=":uno: flex list-none items-center">
            <Link to="/" className={`:uno: flex items-center ${navigationMenuTriggerStyle()}`}>
              <PorterLogo />
            </Link>
          </NavigationMenuItem>

          <NavigationMenuList className=":uno: !hidden md:!flex">
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                My Health
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                My Benefits
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Learn
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Support
              </Link>
            </NavigationMenuItem>

          </NavigationMenuList>
        </div>
        <div className=":uno: flex items-center space-x-2">
          <img src={UserIcon} className=":uno: text-white" />
          <div className=":uno: text-center font-medium">Hi Jordan</div>

        </div>

      </NavigationMenu>
    </div>
  )
}

export default HeaderMain
