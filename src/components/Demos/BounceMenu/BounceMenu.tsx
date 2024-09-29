import { useState } from 'react'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { Icon } from '@iconify/react'
import BounceMenuBackground from './BounceMenuBackground'
import BounceMenuSection from './BounceMenuSection'
import BounceMenuButtons from './BounceMenuButtons'
import BounceMenuAppSubItem from './BounceMenuAppSubItem'
import BounceMenuComponentSubItem from './BounceMenuComponentSubItem'
import BounceMenuNotesSubItem from './BounceMenuNotesSubItem'

interface BounceMenuProps {
  className?: string
}

function BounceMenu({ className }: BounceMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const handleMouseEnter = (menuId: string) => {
    setActiveMenu(menuId)
  }

  const handleMouseLeave = () => {
    setActiveMenu(null)
  }

  const containerVariants: Variants = {
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 11,
      },
    },
    initial: {
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 8,
      },
    },
  }

  const menuItemVariants: Variants = {
    open: {
      maxHeight: 500,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 8,
      },
    },
    closed: {
      maxHeight: 0,
      opacity: 0,
      transition: {
        duration: 0.05,
      },
    },
  }

  const transitionClass = 'transition-all duration-275 ease-in-out'

  return (
    <div className={`relative ${className}`}>
      <BounceMenuBackground>
        <div className="group absolute relative left-10 top--18">
          <div className={`bg-#FFF6EB ring-1 ring-orange/05 rounded-4 h-40 w-40 p-4 z-2 absolute top-0 shadow-md group-hover:scale-105  flex flex-col justify-end items-center ${transitionClass}`}>
            <div className="text-center space-y-4">
              <div className="text-2xl text-#FF7D8D font-semibold">Jun 12</div>
              <div className="">Today</div>
            </div>
          </div>

          <div className={`bg-#EBC6B1 ring-1 ring-orange/05 rounded-4 h-40 w-40 p-4 z-1 absolute rotate--4 top-2 left-1 shadow-lg group-hover:scale-107 group-hover:rotate--09 ${transitionClass}`} />
          <div className={`bg-#E8BEA6 ring-1 ring-orange/05 rounded-4 h-40 w-40 p-4 z-0 absolute rotate--4 top-2 left-1 shadow-lg group-hover:scale-107 group-hover:rotate--18 ${transitionClass}`} />
        </div>
        <div className={`absolute top--8 left-45 rotate-4 relative z-10 group hover:rotate-2 ${transitionClass}`}>
          <div className="z-1 h-30 w-80 flex flex-col rounded-2xl bg-#FFF6EB p-4 shadow-lg ring-1 ring-orange/05">
            <div className={`flex items-center justify-between mt-auto hover:bg-#121212/05 rounded-lg p-2 hover:px-3 ${transitionClass}`}>
              <div className="flex items-center gap-2 text-#121212/60">
                <Icon icon="ph:paperclip" className="size-4" />
                <div>Todo</div>
                <div>·</div>
                <div>2 months ago</div>
              </div>
              <Icon icon="ph:arrow-square-out" className="size-4 text-#121212/90" />
            </div>
            <div className={`flex items-center justify-between mt-auto hover:bg-#121212/05 rounded-lg p-2 hover:px-3 ${transitionClass}`}>
              <div className="flex items-center gap-2 text-#121212/60">
                <Icon icon="ph:paperclip" className="size-4" />
                <div>Todo</div>
                <div>·</div>
                <div>2 months ago</div>
              </div>
              <Icon icon="ph:arrow-square-out" className="size-4 text-#121212/90" />
            </div>
          </div>

        </div>
        <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
          <motion.div
            className="rounded-2xl bg-[#121212]/07 bg-opacity-80 px-2 py-1 shadow-xl ring-1 ring-black/10 backdrop-blur backdrop-blur-lg md:px-3 md:py-2"
            onMouseLeave={handleMouseLeave}
            variants={containerVariants}
            initial="initial"
            whileHover="hover"
          >
            <BounceMenuSection isActive={activeMenu === 'apps'} menuItemVariants={menuItemVariants}>
              <BounceMenuAppSubItem
                title="Klack"
                description="Satisfying Key Sounds"
                icon="ph:keyboard"
              />
              <BounceMenuAppSubItem
                title="Quill"
                description="Craft pages, and docs"
                icon="ph:pen-nib-straight"
              />
            </BounceMenuSection>

            <BounceMenuSection isActive={activeMenu === 'components'} menuItemVariants={menuItemVariants}>
              <BounceMenuComponentSubItem
                title="Action Bar"
                type="Dynamic"
                date="06/24"
              />
              <BounceMenuComponentSubItem
                title="Image Expand"
                type="Overlay"
                date="05/24"
              />
              <BounceMenuComponentSubItem
                title="Read Time"
                type="Scroll"
                date="04/24"
              />
            </BounceMenuSection>

            <BounceMenuSection isActive={activeMenu === 'notes'} menuItemVariants={menuItemVariants}>
              <BounceMenuNotesSubItem
                title="Changelog using Github"
                date="Jun, 2024"
              />
              <BounceMenuNotesSubItem
                title="Feedback in Slack"
                date="May, 2024"
              />
            </BounceMenuSection>

            <BounceMenuButtons activeMenu={activeMenu} handleMouseEnter={handleMouseEnter} />
          </motion.div>
        </div>
      </BounceMenuBackground>
    </div>
  )
}

export default BounceMenu
