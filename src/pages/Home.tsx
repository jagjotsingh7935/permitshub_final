import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, CircleArrowRight, ExternalLink } from 'lucide-react'
import { ArchitecturalHero } from '../components/home/ArchitecturalHero'
import { PillarsStrip } from '../components/home/PillarsStrip'
import { ProjectStarter } from '../components/home/ProjectStarter'
import { ServicesEditorial } from '../components/home/ServicesEditorial'
import { PortfolioSectors } from '../components/projects/PortfolioSectors'
import { ProjectShowcase } from '../components/projects/ProjectShowcase'
import { SiteEvolution } from '../components/about/SiteEvolution'
import { WithCoordination, WithoutCoordination } from '../components/about/CoordinationDiagram'
import { Accordion } from '../components/ui/Accordion'
import { PlanningJourney } from '../components/ui/PlanningJourney'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction, SectionIntro } from '../components/ui/Sections'
import { useSite } from '../site/SiteProvider'

export default function Home() {
  const { t, rt, audiences, challenges, chapters, enquiryGroups, homeFaqs, coordinationBenefits } = useSite()
  const milestones = chapters.filter(chapter => chapter.type === 'milestone')
  return (
    <>
      {/* 1 · Preserved 3D hero */}
      <ArchitecturalHero />

      <PillarsStrip />

      {/* 2 · Introduction and who Permits Hub helps */}
      <section className="home-intro" id="planning-content" aria-labelledby="intro-title">
        <div className="container home-intro__grid">
          <Reveal className="home-intro__lead">
            <span className="eyebrow"><span className="eyebrow__line" />{t('home.intro.eyebrow')}</span>
            <h2 id="intro-title">{t('home.intro.title')}</h2>
          </Reveal>
          <div className="home-intro__body">
            <Reveal>
              <p>{t('home.intro.p1')}</p>
              <p>{t('home.intro.p2')}</p>
            </Reveal>
            <h3 className="home-intro__subhead">{t('home.intro.subhead')}</h3>
            <RevealGroup as="ul" className="audience-rows">
              {audiences.map(audience => (
                <RevealItem as="li" key={audience.title}><strong>{audience.title}</strong><span>{audience.body}</span></RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* 2.5 · Why coordination matters: Many parties, one clear line */}
      <section className="coordination-section" aria-labelledby="home-coordination-title">
        <div aria-hidden="true" className="planning-grid-dark pointer-events-none" style={{ position: 'absolute', inset: 0 }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <SectionIntro
              id="home-coordination-title"
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

      {/* 3 · Service overview */}
      <section className="section section--services" aria-labelledby="services-title">
        <div className="container">
          <div className="section-head">
            <Reveal><SectionIntro id="services-title" eyebrow={t('home.services.eyebrow')} title={rt('home.services.title')} body={t('home.services.body')} /></Reveal>
            <Reveal className="section-head__action"><Link to="/services" className="text-link">{t('home.services.link')} <CircleArrowRight size={22} /></Link></Reveal>
          </div>
          <ServicesEditorial />
        </div>
      </section>

      {/* 4 · Types of enquiries */}
      <section className="enquiry-types" aria-labelledby="enquiry-title">
        <div className="container">
          <div className="enquiry-types__head">
            <h2 id="enquiry-title">{t('home.enquiry.title')}</h2>
            <p>{t('home.enquiry.body')}</p>
          </div>
          <RevealGroup className="enquiry-types__grid">
            {enquiryGroups.map(group => (
              <RevealItem key={group.heading} className="enquiry-types__group">
                <h3>{group.heading}</h3>
                <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 5 · Common challenges */}
      <section className="challenges" aria-labelledby="challenges-title">
        <div className="container challenges__grid">
          <div className="challenges__intro">
            <Reveal>
              <span className="eyebrow eyebrow--on-dark"><span className="eyebrow__line" />{t('home.challenges.eyebrow')}</span>
              <h2 id="challenges-title">{t('home.challenges.title')}</h2>
              <p>{t('home.challenges.body')}</p>
              <Link to="/contact" className="text-link text-link--light">{t('home.challenges.link')} <ArrowRight size={18} /></Link>
            </Reveal>
          </div>
          <RevealGroup as="ol" className="challenges__list">
            {challenges.map((item, index) => (
              <RevealItem as="li" key={item.challenge}>
                <span className="challenges__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.challenge}</h3>
                <p><span className="sr-only">{t('home.challenges.step_label')} </span>{item.response}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* 6 · Planning journey */}
      <section className="section journey-section" aria-labelledby="journey-title">
        <div className="container">
          <div className="section-head">
            <Reveal><SectionIntro id="journey-title" eyebrow={t('home.journey.eyebrow')} title={rt('home.journey.title')} body={t('home.journey.body')} /></Reveal>
          </div>
          <PlanningJourney variant="diagram" />
        </div>
      </section>

      {/* 7 · Selected real projects */}
      <section className="section projects-section" aria-labelledby="projects-title">
        <div className="container">
          <div className="section-head">
            <Reveal><SectionIntro id="projects-title" eyebrow={t('home.projects.eyebrow')} title={rt('home.projects.title')} body={t('home.projects.body')} /></Reveal>
            <Reveal className="section-head__action"><Link to="/projects" className="text-link">{t('home.projects.link')} <CircleArrowRight size={22} /></Link></Reveal>
          </div>
          <Reveal><PortfolioSectors /></Reveal>
          <Reveal><ProjectShowcase /></Reveal>
          <p className="project-note">{t('home.projects.note')}</p>
        </div>
      </section>

      {/* 8 · About preview */}
      <section className="about-preview" aria-labelledby="about-preview-title">
        <div className="container about-preview__grid">
          <Reveal className="about-preview__visual">
            <figure>
              <SiteEvolution stage={4} label={t('home.about.alt')} />
              <figcaption>{t('home.about.caption')}</figcaption>
            </figure>
          </Reveal>
          <div className="about-preview__copy">
            <Reveal>
              <h2 id="about-preview-title">{t('home.about.title')}</h2>
              <p>{t('home.about.body')}</p>
            </Reveal>
            <RevealGroup as="ol" className="about-preview__milestones">
              {milestones.map(chapter => (
                <RevealItem as="li" key={chapter.id}><span>{chapter.marker}</span><strong>{chapter.title}</strong></RevealItem>
              ))}
            </RevealGroup>
            <Link to="/about" className="button button--outline">{t('home.about.button')} <ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </section>

      {/* 9 · Enquiry starter */}
      <section className="starter-band" aria-labelledby="starter-title">
        <div className="container starter-band__grid">
          <div>
            <span className="eyebrow"><span className="eyebrow__line" />{t('home.starter.eyebrow')}</span>
            <h2 id="starter-title">{rt('home.starter.title')}</h2>
            <p>{t('home.starter.body')}</p>
            <span className="starter-band__aside">{t('home.starter.aside')}</span>
          </div>
          <ProjectStarter />
        </div>
      </section>

      {/* 10 · FAQs */}
      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="container faq-section__inner">
          <Reveal>
            <SectionIntro id="faq-title" eyebrow={t('home.faq.eyebrow')} title={rt('home.faq.title')} body={t('home.faq.body')} />
            <a href="https://www.planning.vic.gov.au/" target="_blank" rel="noreferrer" className="text-link faq-section__link">{t('home.faq.link')} <ExternalLink size={15} /><span className="sr-only"> (opens in a new tab)</span></a>
          </Reveal>
          <Accordion items={homeFaqs.map(faq => ({ id: faq.id, title: faq.question, content: <p>{faq.answer}</p> }))} />
        </div>
      </section>

      {/* 11 · Final call to action */}
      <CallToAction />
    </>
  )
}
