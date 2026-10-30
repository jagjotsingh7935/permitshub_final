import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { Accordion } from '../components/ui/Accordion'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction, PageHero, SectionIntro } from '../components/ui/Sections'
import { mediaUrl } from '../api/client'
import type { Service } from '../content'
import { useSite } from '../site/SiteProvider'

function contactLink(service: Service) {
  return `/contact?${new URLSearchParams({ projectType: service.enquiryType, service: service.title }).toString()}#enquiry`
}

function ServiceFinder() {
  const { t, serviceFinder, services } = useSite()
  const [selected, setSelected] = useState(0)
  const option = serviceFinder[selected]
  if (!option) return null
  return (
    <section className="service-finder" aria-labelledby="finder-title">
      <div className="container service-finder__grid">
        <div>
          <h2 id="finder-title">{t('services.finder.title')}</h2>
          <p>{t('services.finder.body')}</p>
        </div>
        <div className="service-finder__tool">
          <div className="service-finder__options" role="group" aria-label="Where are you up to?">
            {serviceFinder.map((item, index) => (
              <button key={item.stage} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.prompt}</button>
            ))}
          </div>
          <div className="service-finder__result" aria-live="polite">
            <p>{option.answer}</p>
            <ul>
              {option.services.map(id => {
                const service = services.find(item => item.id === id)
                if (!service) return null
                return <li key={id}><a href={`#${id}`}><span>{service.number}</span>{service.title}<ArrowUpRight size={16} /></a></li>
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function StageStrip({ service }: { service: Service }) {
  const { t, journeyStages } = useSite()
  return (
    <div className="stage-strip">
      <p>{t('services.block.stage')}</p>
      <ol>
        {journeyStages.map(stage => {
          const on = service.stages.includes(stage.id)
          return <li key={stage.id} className={on ? 'is-on' : ''}><span aria-hidden="true" />{stage.short}<span className="sr-only">{on ? ': relevant' : ': not usually'}</span></li>
        })}
      </ol>
    </div>
  )
}

function ServiceBlock({ service, index }: { service: Service; index: number }) {
  const { t, services, verifiedProjects } = useSite()
  const Icon = service.icon
  const related = (service.relatedProjects ?? []).map(slug => verifiedProjects.find(project => project.slug === slug)).filter(project => project !== undefined)
  return (
    <section id={service.id} className={`service-block ${index % 2 ? 'service-block--flip' : ''}`} aria-labelledby={`${service.id}-title`}>
      <div className="container service-block__grid">
        <div className="service-block__copy">
          <Reveal>
            <p className="service-block__number"><span>{service.number}</span> of 0{services.length}</p>
            <h2 id={`${service.id}-title`}>{service.title}</h2>
            <p className="service-block__lead">{service.description}</p>
            <h3>{t('services.block.involves')}</h3>
            <p className="service-block__involves">{service.involves}</p>
          </Reveal>
          <div className="service-block__lists">
            <Reveal>
              <h3>{t('services.block.who')}</h3>
              <ul className="tick-list">{service.whoFor.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
            </Reveal>
            <Reveal delay={0.06}>
              <h3>{t('services.block.when')}</h3>
              <ul className="dash-list">{service.situations.map(item => <li key={item}>{item}</li>)}</ul>
            </Reveal>
          </div>
          <Accordion
            className="service-block__details"
            defaultOpen={null}
            multiple
            headingLevel={3}
            items={[
              { id: 'inputs', title: t('services.block.inputs'), meta: `${service.inputs.length} items`, content: <ul className="dash-list">{service.inputs.map(item => <li key={item}>{item}</li>)}</ul> },
              { id: 'deliverables', title: t('services.block.deliverables'), meta: `${service.deliverables.length} items`, content: <ul className="dash-list">{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul> },
            ]}
          />
          <div className="service-block__start">
            <div>
              <h3>{t('services.block.start')}</h3>
              <p>{service.conversation}</p>
            </div>
            <Link to={contactLink(service)} className="button button--primary">{t('services.block.button')} <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <Reveal className="service-block__visual">
          <div className="service-sheet" aria-hidden="true">
            <div className="service-sheet__top"><Icon size={26} strokeWidth={1.5} /><span>{t('services.block.sheet')}</span></div>
            <strong>{service.deliverables[0]}</strong>
            <i /><i /><i className="service-sheet__short" />
            <div className="service-sheet__plan" />
            <i /><i className="service-sheet__short" />
          </div>
          <StageStrip service={service} />
          {related.length > 0 && (
            <div className="service-block__related">
              <p>{t('services.block.related')}</p>
              <ul>
                {related.map(project => (
                  <li key={project.slug}><Link to={`/projects/${project.slug}`}>{project.cover && <img src={mediaUrl(project.cover.src)} alt="" loading="lazy" style={{ objectPosition: project.cover.position ?? undefined }} />}<span>{project.title}<small>{project.place}</small></span></Link></li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

export default function Services() {
  const { t, rt, services, journeyStages, coordinationRoles, engagementFormats, consultationPrep, servicesFaqs, settings } = useSite()
  return (
    <>
      <PageHero eyebrow={t('services.hero.eyebrow')} title={rt('services.hero.title')} body={t('services.hero.body')} number="01">
        <nav className="hero-index" aria-label="Services on this page">
          <p>{t('services.hero.index')}</p>
          <ol>{services.map(service => <li key={service.id}><a href={`#${service.id}`}><span>{service.number}</span>{service.title}</a></li>)}</ol>
        </nav>
      </PageHero>

      <ServiceFinder />

      {services.map((service, index) => <ServiceBlock key={service.id} service={service} index={index} />)}

      <section className="section service-matrix" aria-labelledby="matrix-title">
        <div className="container">
          <Reveal><SectionIntro id="matrix-title" eyebrow={t('services.matrix.eyebrow')} title={t('services.matrix.title')} body={t('services.matrix.body')} /></Reveal>
          <Reveal>
            <div className="matrix-wrap">
              <table className="matrix">
                <caption className="sr-only">Services and the project stages they usually support</caption>
                <thead>
                  <tr><th scope="col">Service</th>{journeyStages.map(stage => <th scope="col" key={stage.id}>{stage.label}</th>)}</tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service.id}>
                      <th scope="row"><a href={`#${service.id}`}><span>{service.number}</span>{service.title}</a></th>
                      {journeyStages.map(stage => {
                        const on = service.stages.includes(stage.id)
                        return <td key={stage.id} data-label={stage.label} className={on ? 'is-on' : ''}>{on ? <><span className="matrix__dot" aria-hidden="true" /><span className="sr-only">Usually relevant</span></> : <span className="sr-only">Not usually</span>}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="coordination" aria-labelledby="coordination-title">
        <div className="container coordination__grid">
          <Reveal>
            <span className="eyebrow eyebrow--on-dark"><span className="eyebrow__line" />{t('services.coord.eyebrow')}</span>
            <h2 id="coordination-title">{t('services.coord.title')}</h2>
            <p>{t('services.coord.body')}</p>
            <p className="coordination__note">{t('services.coord.note')}</p>
          </Reveal>
          <div className="coordination__diagram">
            <div className="coordination__centre" aria-hidden="true"><span>{t('services.coord.centre')}</span></div>
            <RevealGroup as="ul" className="coordination__roles">
              {coordinationRoles.map(item => <RevealItem as="li" key={item.role}><strong>{item.role}</strong><span>{item.input}</span></RevealItem>)}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section className="section engagement" aria-labelledby="engagement-title">
        <div className="container">
          <Reveal><SectionIntro id="engagement-title" eyebrow={t('services.engagement.eyebrow')} title={t('services.engagement.title')} body={t('services.engagement.body')} /></Reveal>
          <RevealGroup as="ol" className="engagement__list">
            {engagementFormats.map((format, index) => (
              <RevealItem as="li" key={format.title}>
                <span className="engagement__step" aria-hidden="true">{index + 1}</span>
                <h3>{format.title}</h3>
                <p>{format.body}</p>
                <p className="engagement__suits"><span>{t('services.engagement.suits')}</span>{format.suits}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section prep-section" aria-labelledby="prep-title">
        <div className="container prep-section__grid">
          <Reveal>
            <SectionIntro id="prep-title" eyebrow={t('services.prep.eyebrow')} title={t('services.prep.title')} body={t('services.prep.body')} />
            <Link to="/contact" className="text-link">{t('services.prep.link')} <ArrowUpRight size={17} /></Link>
          </Reveal>
          <RevealGroup as="ul" className="prep-list">
            {consultationPrep.map(item => <RevealItem as="li" key={item.item}><strong>{item.item}</strong><span>{item.why}</span></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <section className="section faq-section faq-section--tinted" aria-labelledby="services-faq-title">
        <div className="container faq-section__inner">
          <Reveal><SectionIntro id="services-faq-title" eyebrow={t('services.faq.eyebrow')} title={rt('services.faq.title')} /></Reveal>
          <Accordion items={servicesFaqs.map(faq => ({ id: faq.id, title: faq.question, content: <p>{faq.answer}</p> }))} />
        </div>
      </section>

      <section className="services-disclaimer-section" aria-label="Disclaimer">
        <div className="container"><p className="services-disclaimer"><strong>Disclaimer –</strong> {settings.disclaimer}</p></div>
      </section>

      <CallToAction compact title={rt('cta.services.title')} body={t('cta.services.body')} />
    </>
  )
}
