import { useId, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { easeOut } from '../../lib/motion'

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode; meta?: ReactNode }

type AccordionProps = {
  items: AccordionItem[]
  /** Index of the item open on first render, or null for all closed. */
  defaultOpen?: number | null
  multiple?: boolean
  headingLevel?: 2 | 3 | 4
  className?: string
}

/** Accessible disclosure list: real buttons, aria-expanded, labelled regions and a smooth height transition. */
export function Accordion({ items, defaultOpen = 0, multiple = false, headingLevel = 3, className = '' }: AccordionProps) {
  const initial = defaultOpen === null ? [] : [items[defaultOpen]?.id].filter(Boolean) as string[]
  const [open, setOpen] = useState<string[]>(initial)
  const reduced = useReducedMotion()
  const baseId = useId()
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'

  function toggle(id: string) {
    setOpen(current => {
      if (current.includes(id)) return current.filter(item => item !== id)
      return multiple ? [...current, id] : [id]
    })
  }

  return (
    <div className={`accordion ${className}`}>
      {items.map(item => {
        const isOpen = open.includes(item.id)
        const buttonId = `${baseId}-${item.id}-button`
        const panelId = `${baseId}-${item.id}-panel`
        return (
          <div className={`accordion__item ${isOpen ? 'is-open' : ''}`} key={item.id}>
            <Heading className="accordion__heading">
              <button type="button" id={buttonId} aria-expanded={isOpen} aria-controls={isOpen ? panelId : undefined} onClick={() => toggle(item.id)}>
                <span className="accordion__title">{item.title}</span>
                {item.meta && <span className="accordion__meta">{item.meta}</span>}
                <span className="accordion__icon" aria-hidden="true"><ChevronDown size={19} /></span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="accordion__panel"
                  initial={reduced ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.38, ease: easeOut }}
                >
                  <div className="accordion__content">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
