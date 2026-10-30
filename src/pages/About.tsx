import { ArrowDown, Check, ExternalLink } from 'lucide-react'
import { mediaUrl } from '../api/client'
import { CompanyTimeline } from '../components/about/CompanyTimeline'
import { WithCoordination, WithoutCoordination } from '../components/about/CoordinationDiagram'
import { PlanningJourney } from '../components/ui/PlanningJourney'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction, PageHero, SectionIntro } from '../components/ui/Sections'
import { useSite } from '../site/SiteProvider'

export default function About() {
  const { t, rt, image, principles, publicRegions, coordinationBenefits, settings } = useSite()
  const photos = ['about.photo_1', 'about.photo_2', 'about.photo_3'].map(image).filter(photo => photo?.url)
  return (
    <>
      <PageHero eyebrow={t('about.hero.eyebrow')} title={rt('about.hero.title')} body={t('about.hero.body')} number="03">
        <div className="about-hero-aside">
          <dl className="hero-facts">
            <div><dt>{t('about.hero.f1_label')}</dt><dd>{t('about.hero.f1')}</dd></div>
            <div><dt>{t('about.hero.f2_label')}</dt><dd>{t('about.hero.f2')}</dd></div>
            <div><dt>{t('about.hero.f3_label')}</dt><dd>{t('about.hero.f3')}</dd></div>
          </dl>
          <a href="#timeline" className="button button--white">{t('about.hero.button')} <ArrowDown size={17} /></a>
        </div>
      </PageHero>

      <section className="section about-main">
        <div className="container about-main__grid">
          <Reveal>
            <div className="about-main__quote about-main__projects">
              <span>{t('about.photos.label')}</span>
              <div className="about-project-photos" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                {photos.map(photo => <div key={photo.url}><img src={mediaUrl(photo.url)} alt={photo.alt} width={photo.width ?? undefined} height={photo.height ?? undefined} loading="lazy" style={{ objectFit: 'cover', height: '100%', width: '100%', objectPosition: photo.position ?? undefined }} /></div>)}
              </div>
              <small>{t('about.photos.caption')}</small>
            </div>
          </Reveal>
          <Reveal>
            <div className="about-main__copy">
              <span className="eyebrow"><span className="eyebrow__line" />{t('about.copy.eyebrow')}</span>
              <h2>{rt('about.copy.title')}</h2>
              <p>{t('about.copy.p1')}</p>
              <p>{t('about.copy.p2')}</p>
              {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="text-link">{t('about.copy.link')} <ExternalLink size={17} /><span className="sr-only"> (opens in a new tab)</span></a>}
            </div>
          </Reveal>
        </div>
      </section>

      <CompanyTimeline />

      <section className="section principles" id="how-we-work" aria-labelledby="principles-title">
        <div className="container principles__grid">
          <Reveal><SectionIntro id="principles-title" eyebrow={t('about.principles.eyebrow')} title={rt('about.principles.title')} /></Reveal>
          <RevealGroup as="ul" className="principles__list">
            {principles.map(item => <RevealItem as="li" key={item.title}><h3>{item.title}</h3><p>{item.body}</p></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      {/* Coordination: Many parties, one clear line */}
      <section className="coordination-section" aria-labelledby="coordination-title">
        <div aria-hidden="true" className="planning-grid-dark pointer-events-none" style={{ position: 'absolute', inset: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <SectionIntro
              id="coordination-title"
              eyebrow={t('coord.eyebrow')}
              title={rt('coord.title', { color: '#6db2fb', fontStyle: 'normal' })}
              body={t('coord.body')}
              light
            />
          </Reveal>

          <div className="coordination-grid">
            <Reveal>
              <figure className="coordination-card">
                <figcaption>{t('coord.without')}</figcaption>
                <div className="coordination-card__visual">
                  <WithoutCoordination />
                </div>
              </figure>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="coordination-card coordination-card--highlight">
                <figcaption>{t('coord.with')}</figcaption>
                <div className="coordination-card__visual">
                  <WithCoordination />
                </div>
              </figure>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <ul className="coordination-benefits">
              {coordinationBenefits.map((benefit) => (
                <li key={benefit}>
                  <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="regions" aria-labelledby="regions-title">
        <div className="container regions__grid">
          <Reveal>
            <h2 id="regions-title">{t('about.regions.title')}</h2>
            <p>{t('about.regions.body')}</p>
          </Reveal>
          <RevealGroup as="ul" className="regions__list">
            {publicRegions.map(region => (
              <RevealItem as="li" key={region.name}>
                <strong>{region.name}</strong>
                <span>{region.note}</span>
                {region.source && <a href={region.source.url} target="_blank" rel="noreferrer">{region.source.label} <ExternalLink size={13} /><span className="sr-only"> (opens in a new tab)</span></a>}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section approach-section" aria-labelledby="process-title">
        <div className="container approach-redesign">
          <div>
            <SectionIntro id="process-title" eyebrow={t('about.process.eyebrow')} title={rt('about.process.title')} body={t('about.process.body')} />
          </div>
          <PlanningJourney />
        </div>
      </section>

      <CallToAction compact />
    </>
  )
}
