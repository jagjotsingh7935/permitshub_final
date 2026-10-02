import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'
import { easeOut, revealDistance, revealDuration, revealViewport, staggerStep } from '../../lib/motion'

type RevealProps = { children: ReactNode; className?: string; delay?: number; id?: string }

/** Subtle fade and rise when a block enters the viewport. Content is never hidden for reduced-motion users. */
export function Reveal({ children, className = '', delay = 0, id }: RevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      id={id}
      className={className}
      initial={reduced ? false : { opacity: 0, y: revealDistance }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: revealDuration, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

const groupVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: staggerStep } } }
const itemVariants: Variants = {
  hidden: { opacity: 0, y: revealDistance },
  show: { opacity: 1, y: 0, transition: { duration: revealDuration, ease: easeOut } },
}

/** Staggers direct <RevealItem> children. Use for short lists, not whole pages. */
export function RevealGroup({ children, className = '', as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'ul' | 'ol' }) {
  const reduced = useReducedMotion()
  const Component = as === 'ul' ? motion.ul : as === 'ol' ? motion.ol : motion.div
  return (
    <Component className={className} variants={groupVariants} initial={reduced ? false : 'hidden'} whileInView="show" viewport={revealViewport}>
      {children}
    </Component>
  )
}

export function RevealItem({ children, className = '', as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const Component = as === 'li' ? motion.li : as === 'article' ? motion.article : motion.div
  return <Component className={className} variants={itemVariants}>{children}</Component>
}
