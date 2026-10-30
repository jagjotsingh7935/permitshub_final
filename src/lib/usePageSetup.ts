import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { useSite } from '../site/SiteProvider'
import { scrollToElement, scrollToPosition, setPageScroller } from './scroll'

function setHead(selector: string, attribute: string, value: string, create?: () => HTMLElement) {
  let element = document.head.querySelector<HTMLElement>(selector)
  if (!element) {
    if (!create) return
    element = create()
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

/** Page titles, scroll reset, hash targets and the one Lenis instance for the whole app. */
export function usePageSetup() {
  const location = useLocation()
  const { pages, siteUrl } = useSite()

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
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])

  // The server already renders these tags for the first load; this keeps them right when navigating inside the app.
  useEffect(() => {
    const page = pages[location.pathname] ?? pages['/']
    if (!page) return
    document.title = page.title
    setHead('meta[name="description"]', 'content', page.description, () => { const el = document.createElement('meta'); el.setAttribute('name', 'description'); return el })
    setHead('link[rel="canonical"]', 'href', `${siteUrl}${location.pathname}`, () => { const el = document.createElement('link'); el.setAttribute('rel', 'canonical'); return el })
    setHead('meta[property="og:title"]', 'content', page.title)
    setHead('meta[property="og:description"]', 'content', page.description)
    setHead('meta[property="og:url"]', 'content', `${siteUrl}${location.pathname}`)
  }, [location.pathname, pages, siteUrl])

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
