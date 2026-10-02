import type Lenis from 'lenis'

/*
 * Single scroll controller. Lenis runs on desktop pointers only; everywhere else native scrolling is used.
 * All programmatic scrolling goes through these helpers so the two never compete.
 */
let activeScroller: Lenis | undefined

export function setPageScroller(scroller: Lenis | undefined) {
  activeScroller = scroller
}

export function scrollToPosition(top: number, immediate = false) {
  if (activeScroller) {
    // Lenis clamps to the page height it last measured. Pages load lazily, so re-measure first,
    // otherwise a deep link such as /services#site-feasibility stops short on a fresh load.
    activeScroller.resize()
    activeScroller.scrollTo(top, { immediate, duration: 1.1 })
  } else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
}

/** Scroll an element into view, leaving `offset` pixels above it (for the fixed header). */
export function scrollToElement(element: HTMLElement, offset = 100) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = element.getBoundingClientRect().top + window.scrollY - offset
  scrollToPosition(Math.max(0, top), reduced)
}
