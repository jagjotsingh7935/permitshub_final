import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useSite } from '../../site/SiteProvider'
import { Reveal } from './Reveal'

export function SectionIntro({ eyebrow, title, body, light = false, id }: { eyebrow?: string; title: ReactNode; body?: ReactNode; light?: boolean; id?: string }) {
  return (
    <div className={`section-intro ${light ? 'section-intro--light' : ''}`}>
      {eyebrow && <span className={`eyebrow ${light ? 'eyebrow--on-dark' : ''}`}><span className="eyebrow__line" />{eyebrow}</span>}
      <h2 id={id}>{title}</h2>
      {body && <p>{body}</p>}
    </div>
  )
}

export function PageHero({ eyebrow, title, body, number, children }: { eyebrow: string; title: ReactNode; body: string; number: string; children?: ReactNode }) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <div className="page-hero__copy">
          <Reveal>
            <span className="eyebrow eyebrow--on-dark"><span className="eyebrow__line" />{eyebrow}</span>
            <h1>{title}</h1>
            <p>{body}</p>
          </Reveal>
        </div>
        {children ? <div className="page-hero__aside">{children}</div> : <div className="page-hero__number" aria-hidden="true">{number}</div>}
      </div>
    </section>
  )
}

export function CallToAction({ compact = false, title, body }: { compact?: boolean; title?: ReactNode; body?: string }) {
  const { t, rt } = useSite()
  return (
    <section className={`cta-section ${compact ? 'cta-section--compact' : ''}`}>
      <div className="container cta-section__inner">
        <div className="cta-section__mark" aria-hidden="true"><ArrowUpRight size={250} strokeWidth={0.7} /></div>
        <Reveal>
          <span className="eyebrow eyebrow--on-dark"><span className="eyebrow__line" />{t('cta.eyebrow')}</span>
          <h2>{title ?? rt('cta.title')}</h2>
          <p>{body ?? t('cta.body')}</p>
          <Link to="/contact" className="button button--white">{t('cta.button')} <ArrowUpRight size={19} /></Link>
        </Reveal>
      </div>
    </section>
  )
}
