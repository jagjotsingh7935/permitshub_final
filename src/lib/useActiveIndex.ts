import { useEffect, useState, type RefObject } from 'react'

/**
 * Returns the index of the last element whose top has passed a reading line (45% of the viewport).
 * Works in both scroll directions, updates state only when the index changes, and throttles to one
 * measurement per animation frame.
 */
export function useActiveIndex(refs: RefObject<(HTMLElement | null)[]>, count: number, line = 0.45) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const threshold = window.innerHeight * line
      let next = 0
      refs.current?.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top <= threshold) next = index
      })
      setActive(current => (current === next ? current : next))
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [refs, count, line])
  return active
}
