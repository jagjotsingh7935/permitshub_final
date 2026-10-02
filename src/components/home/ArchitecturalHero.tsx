import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import type { ArchitecturalController } from './architecturalScene'
import { scrollToPosition } from '../../lib/scroll'

const chapters = [
  { label: 'The possibility', title: <>Good places.<br />Start with<br /><em>a clear plan.</em></>, body: 'From a first idea to the next approval. Town planning guidance for the places our communities need.', note: 'A new perspective on what comes next.' },
  { label: 'The planning', title: <>Every detail.<br />Part of<br /><em>a bigger picture.</em></>, body: 'Site context. Planning controls. A considered application. Bringing the moving parts into a clearer view.', note: 'Understanding how everything fits together.' },
  { label: 'The next chapter', title: <>Your vision.<br />A considered<br /><em>way forward.</em></>, body: 'Take the next step with a practical understanding of your site, your project and the planning journey ahead.', note: 'The right conversation can open possibilities.' },
]

export function ArchitecturalHero() {
  const section = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const controller = useRef<ArchitecturalController | null>(null)
  const progress = useRef(0)
  const progressBar = useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = useState(0)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const host = canvas.current
    if (!host || reduced) return
    let cancelled = false
    let current: ArchitecturalController | undefined
    import('./architecturalScene').then(({ createArchitecturalScene }) => {
      if (cancelled) return
      try {
        current = createArchitecturalScene(host, () => setReady(false))
        controller.current = current
        current.setProgress(progress.current)
        setReady(true)
      } catch {
        setReady(false)
      }
    }).catch(() => { if (!cancelled) setReady(false) })
    return () => { cancelled = true; current?.dispose(); controller.current = null }
  }, [reduced])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 850px), (max-height: 600px), (pointer: coarse), (prefers-reduced-motion: reduce)')
    const update = () => {
      const element = section.current
      if (!element || media.matches) return
      const scrollRoom = element.offsetHeight - (window.innerHeight - 82)
      const value = Math.max(0, Math.min(1, (82 - element.getBoundingClientRect().top) / Math.max(1, scrollRoom)))
      progress.current = value
      controller.current?.setProgress(value)
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${value})`
      const next = value < 0.32 ? 0 : value < 0.72 ? 1 : 2
      setChapter(previous => previous === next ? previous : next)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    media.addEventListener('change', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); media.removeEventListener('change', update) }
  }, [])

  function selectChapter(index: number) {
    const element = section.current
    if (!element) return
    const value = [0, 0.5, 1][index]
    const compact = window.matchMedia('(max-width: 850px), (max-height: 600px), (pointer: coarse), (prefers-reduced-motion: reduce)').matches
    if (compact) {
      setChapter(index)
      progress.current = value
      controller.current?.setProgress(value)
      if (progressBar.current) progressBar.current.style.transform = `scaleX(${value})`
    } else {
      const top = window.scrollY + element.getBoundingClientRect().top - 82
      scrollToPosition(top + value * (element.offsetHeight - window.innerHeight + 82))
    }
  }

  return <section className={`architectural-story ${reduced ? 'architectural-story--still' : ''}`} ref={section} aria-label="A clearer planning journey">
    <div className="architectural-stage">
      <div className="architectural-stage__grid" aria-hidden="true" />
      <div className="container architectural-stage__top"><span><i /> TOWN PLANNING / VICTORIA</span><a href="#planning-content">Skip to the details <ArrowDown size={13} /></a></div>
      <div className="container architectural-stage__body">
        <div className="architectural-copy">
          <span className="architectural-copy__chapter">0{chapter + 1} / {chapters[chapter].label}</span>
          <div key={chapter} className="architectural-copy__text"><h1>{chapters[chapter].title}</h1><p>{chapters[chapter].body}</p></div>
          <Link to="/contact" className="button button--primary">Discuss your project <ArrowUpRight size={18} /></Link>
          <Link to="/projects" className="architectural-copy__link">Explore our work <MoveUpRight size={15} /></Link>
        </div>
        <figure className={`architectural-model ${ready && !reduced ? 'architectural-model--ready' : ''}`}>
          <div className="architectural-model__viewport">
            <img src="/images/architectural-study.svg" alt="" className="architectural-model__fallback" fetchPriority="high" />
            <canvas ref={canvas} aria-hidden="true" />
          </div>
          <div className="architectural-model__north" aria-hidden="true">N<span>↑</span></div>
          <figcaption><span className="architectural-model__caption-title">THE COMMUNITY PAVILION</span><span>Concept study · illustrative architecture</span></figcaption>
          <div className="architectural-model__scale" aria-hidden="true"><i /><span>PERMITS HUB / DESIGN PERSPECTIVES</span></div>
        </figure>
      </div>
      <div className="container architectural-stage__bottom">
        <div className="architectural-chapters" role="group" aria-label="Explore the three planning chapters">{chapters.map((item, index) => <button type="button" key={item.label} aria-pressed={chapter === index} onClick={() => selectChapter(index)}><span>0{index + 1}</span>{item.label}</button>)}</div>
        <span className="architectural-scroll"><ArrowDown size={16} />Scroll to explore</span>
      </div>
      <div className="architectural-progress" aria-hidden="true"><div ref={progressBar} /></div>
    </div>
  </section>
}

