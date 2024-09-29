import BounceMenuButton from './BounceMenuButton'

interface MenuButtonsProps {
  activeMenu: string | null
  handleMouseEnter: (menuId: string) => void
}

function BounceMenuButtons({ activeMenu, handleMouseEnter }: MenuButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      <BounceMenuButton
        id="apps"
        title="Apps"
        icon="ph:squares-four"
        onMouseEnter={() => handleMouseEnter('apps')}
        isActive={activeMenu === 'apps'}
      />
      <BounceMenuButton
        id="components"
        title="Components"
        icon="ph:code"
        onMouseEnter={() => handleMouseEnter('components')}
        isActive={activeMenu === 'components'}
      />
      <BounceMenuButton
        id="notes"
        title="Notes"
        icon="ph:paperclip"
        onMouseEnter={() => handleMouseEnter('notes')}
        isActive={activeMenu === 'notes'}
      />
    </div>
  )
}

export default BounceMenuButtons
