import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { pageTitles } from '../content'
import { scrollToElement, scrollToPosition, setPageScroller } from './scroll'

/** Page titles, scroll reset, hash targets and the one Lenis instance for the whole app. */
export function usePageSetup() {
  const location = useLocation()

  useEffect(() => {
    let frame = 0
    if (!location.hash) scrollToPosition(0, true)
    else {
      // Pages are lazy-loaded, so wait briefly for the target to exist before scrolling to it.
      const id = decodeURIComponent(location.hash.slice(1))
      const started = performance.now()
      const seek = () => {
        const target = document.getElementById(id)
        if (target) scrollToElement(target, 100)
        else if (performance.now() - started < 1500) frame = requestAnimationFrame(seek)
      }
      frame = requestAnimationFrame(seek)
    }
    const fallback = location.pathname.startsWith('/projects/') ? 'Project — Permits Hub' : 'Permits Hub'
    document.title = pageTitles[location.pathname] ?? fallback
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touch = window.matchMedia('(pointer: coarse)')
    let lenis: Lenis | undefined
    const sync = () => {
      lenis?.destroy()
      lenis = undefined
      if (!reduced.matches && !touch.matches) lenis = new Lenis({ autoRaf: true, duration: 1.05, smoothWheel: true, anchors: { offset: -100 } })
      setPageScroller(lenis)
    }
    sync()
    reduced.addEventListener('change', sync)
    touch.addEventListener('change', sync)
    return () => {
      lenis?.destroy()
      setPageScroller(undefined)
      reduced.removeEventListener('change', sync)
      touch.removeEventListener('change', sync)
    }
  }, [])
}
