import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from 'motion/react'
import { ArrowDown, ArrowUpRight, Check, ExternalLink } from 'lucide-react'
import { chapters, evolutionStages, facebookUrl, formatDate, publicRegions, verifiedProjects, type Chapter } from '../../content'
import { easeOut } from '../../lib/motion'
import { scrollToElement } from '../../lib/scroll'
import { useActiveIndex } from '../../lib/useActiveIndex'
import { useMediaQuery } from '../../lib/useMediaQuery'
import { SiteEvolution } from './SiteEvolution'

const typeLabels: Record<Chapter['type'], string> = {
  milestone: 'Dated milestone',
  perspective: 'Our approach',
  now: 'Current work',
  next: 'Your next step',
}

const chapterVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
}

function ChapterMedia({ chapter }: { chapter: Chapter }) {
  const media = chapter.media
  if (media.kind === 'record') {
    return (
      <div className="chapter-record">
        <p className="chapter-record__title">{media.title}</p>
        <dl>{media.lines.map(line => <div key={line.label}><dt>{line.label}</dt><dd>{line.value}</dd></div>)}</dl>
        <a href={media.source.url} target="_blank" rel="noreferrer">{media.source.label} <ExternalLink size={13} /><span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    )
  }
  if (media.kind === 'checklist') {
    return (
      <div className="chapter-checklist">
        <p>{media.title}</p>
        <ul>{media.items.map(item => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul>
      </div>
    )
  }
  if (media.kind === 'projects') {
    const items = media.slugs.map(slug => verifiedProjects.find(project => project.slug === slug)).filter(project => project !== undefined)
    return (
      <ul className="chapter-projects">
        {items.map(project => (
          <li key={project.slug}>
            <Link to={`/projects/${project.slug}`}>
              <span className="chapter-projects__image"><img src={project.cover.src} alt="" loading="lazy" style={{ objectPosition: project.cover.position }} /></span>
              <span className="chapter-projects__date">{formatDate(project.updateDate)}</span>
              <strong>{project.title}</strong>
              <small>{project.place}</small>
            </Link>
          </li>
        ))}
      </ul>
    )
  }
  if (media.kind === 'figures') {
    return (
      <ul className="chapter-figures">
        {media.items.map(item => <li key={item.label}><Link to={item.href}><strong>{item.value}</strong><span>{item.label}</span></Link></li>)}
      </ul>
    )
  }
  if (media.kind === 'regions') {
    return (
      <div className="chapter-regions">
        <ul>{publicRegions.map(region => <li key={region.name}><strong>{region.name}</strong><span>{region.note}</span></li>)}</ul>
        <a href={facebookUrl} target="_blank" rel="noreferrer" className="text-link">Latest updates on Facebook <ExternalLink size={15} /><span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    )
  }
  return (
    <div className="chapter-cta">
      <Link to="/contact" className="button button--primary">Start a conversation <ArrowUpRight size={18} /></Link>
      <Link to="/services" className="text-link">See how we can help <ArrowUpRight size={16} /></Link>
    </div>
  )
}

/**
 * The signature About timeline.
 * - Desktop (≥1024px wide, ≥620px tall): narrative on the left, a sticky evolving drawing on the right,
 *   a scroll-linked progress rail and chapter buttons. Nothing is pinned; the page scrolls normally.
 * - Smaller screens: one column with a drawing inside each chapter.
 * - Reduced motion: rail shown full, no reveals or camera movement; all content is present regardless.
 */
export function CompanyTimeline() {
  const listRef = useRef<HTMLOListElement>(null)
  const chapterRefs = useRef<(HTMLElement | null)[]>([])
  const reduced = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px) and (min-height: 620px)')
  const active = useActiveIndex(chapterRefs, chapters.length)

  // Progress follows the reader through the list and reverses naturally on the way back up.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 55%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32, restDelta: 0.001 })
  const tilt = useTransform(scrollYProgress, [0, 1], [8, -2])
  const drift = useTransform(scrollYProgress, [0, 1], [12, -12])

  const current = chapters[active]
  const stage = evolutionStages[current.stage]

  function jump(index: number) {
    const element = chapterRefs.current[index]
    if (element) scrollToElement(element, Math.round(window.innerHeight * 0.3))
  }

  return (
    <section className="timeline" aria-labelledby="timeline-title" id="timeline">
      <div className="container">
        <header className="timeline__header">
          <div>
            <span className="eyebrow"><span className="eyebrow__line" />Our journey</span>
            <h2 id="timeline-title">From a registered business to the <em>next site.</em></h2>
          </div>
          <div>
            <p>Seven chapters. Dated entries are company history backed by a public source. Undated entries describe how Permits Hub approaches its work.</p>
            <ul className="timeline__legend" aria-label="Timeline key">
              <li><i className="legend-dot legend-dot--milestone" />Dated milestone with source</li>
              <li><i className="legend-dot legend-dot--perspective" />Approach or current work</li>
              <li><i className="legend-dot legend-dot--next" />Your next step</li>
            </ul>
          </div>
        </header>

        <div className="timeline__layout">
          <div className="timeline__narrative">
            <div className="timeline__rail" aria-hidden="true">
              <motion.div className="timeline__rail-fill" style={reduced ? { scaleY: 1 } : { scaleY: progress }} />
            </div>
            <ol className="timeline__list" ref={listRef}>
              {chapters.map((chapter, index) => (
                <li
                  key={chapter.id}
                  id={`chapter-${chapter.id}`}
                  ref={element => { chapterRefs.current[index] = element }}
                  className={`chapter chapter--${chapter.type} ${index === active ? 'is-active' : ''} ${index < active ? 'is-past' : ''} ${index % 2 ? 'chapter--offset' : ''}`}
                >
                  <span className="chapter__node" aria-hidden="true" />
                  <motion.article
                    aria-labelledby={`chapter-title-${chapter.id}`}
                    variants={chapterVariants}
                    initial={reduced ? false : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <motion.p className="chapter__meta" variants={itemVariants}>
                      <span className="chapter__marker">{chapter.marker}</span>
                      <span className="chapter__type">{typeLabels[chapter.type]}</span>
                    </motion.p>
                    <motion.h3 id={`chapter-title-${chapter.id}`} variants={itemVariants}>{chapter.title}</motion.h3>
                    <motion.p className="chapter__eyebrow" variants={itemVariants}>{chapter.eyebrow}</motion.p>
                    {chapter.body.map(paragraph => <motion.p key={paragraph.slice(0, 24)} className="chapter__body" variants={itemVariants}>{paragraph}</motion.p>)}
                    <motion.div className="chapter__media" variants={itemVariants}><ChapterMedia chapter={chapter} /></motion.div>
                    {!wide && (
                      <motion.figure className="chapter__visual" variants={itemVariants}>
                        <SiteEvolution stage={chapter.stage} />
                        <figcaption><strong>{evolutionStages[chapter.stage].label}.</strong> Conceptual illustration, not a Permits Hub project.</figcaption>
                      </motion.figure>
                    )}
                  </motion.article>
                </li>
              ))}
            </ol>
            <div className="timeline__end">
              <span className="timeline__end-node" aria-hidden="true" />
              <p>End of the timeline. Below: how Permits Hub works and where it has worked.</p>
              <a href="#how-we-work" className="text-link">Continue reading <ArrowDown size={16} /></a>
            </div>
          </div>

          {wide && (
            <aside className="timeline__panel" aria-label="Timeline illustration and chapter controls">
              <div className="timeline__panel-inner">
                <div className="timeline__panel-top">
                  <span>Chapter {active + 1} of {chapters.length}</span>
                  <span>{typeLabels[current.type]}</span>
                </div>
                <div className="timeline__stage-frame">
                  <motion.div className="timeline__stage" style={reduced ? undefined : { rotateX: tilt, y: drift }}>
                    <SiteEvolution stage={current.stage} />
                  </motion.div>
                </div>
                <div className="timeline__caption" aria-live="polite">
                  <p><strong>{stage.label}.</strong> {stage.caption}</p>
                  <p className="timeline__disclaimer">Conceptual illustration. Not a Permits Hub project.</p>
                </div>
                <nav className="timeline__nav" aria-label="Timeline chapters">
                  <ol>
                    {chapters.map((chapter, index) => (
                      <li key={chapter.id}>
                        <button type="button" onClick={() => jump(index)} aria-current={index === active ? 'step' : undefined} className={`timeline__nav-item timeline__nav-item--${chapter.type}`}>
                          <span>{chapter.marker}</span>
                          <span className="sr-only">: {chapter.title}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
