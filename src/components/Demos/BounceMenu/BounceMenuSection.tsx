import type { ReactNode } from 'react'
import type { Variants } from 'framer-motion'
import { AnimatePresence, motion } from 'framer-motion'

interface BounceMenuSectionProps {
  isActive: boolean
  children: ReactNode
  menuItemVariants: Variants
}

function BounceMenuSection({ isActive, children, menuItemVariants }: BounceMenuSectionProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="bounce-menu-item-container"
        variants={menuItemVariants}
        initial="closed"
        animate={isActive ? 'open' : 'closed'}
      >
        {children}
        <div className="pb-4" />
      </motion.div>
    </AnimatePresence>
  )
}

export default BounceMenuSection
