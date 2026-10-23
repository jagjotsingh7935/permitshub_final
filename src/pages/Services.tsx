import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { Accordion } from '../components/ui/Accordion'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction, PageHero, SectionIntro } from '../components/ui/Sections'
import {
  consultationPrep,
  coordinationRoles,
  disclaimer,
  engagementFormats,
  journeyStages,
  serviceFinder,
  services,
  servicesFaqs,
  verifiedProjects,
  type Service,
} from '../content'

function contactLink(service: Service) {
  return `/contact?${new URLSearchParams({ projectType: service.enquiryType, service: service.title }).toString()}#enquiry`
}

function ServiceFinder() {
  const [selected, setSelected] = useState(0)
  const option = serviceFinder[selected]
  return (
    <section className="service-finder" aria-labelledby="finder-title">
      <div className="container service-finder__grid">
        <div>
          <h2 id="finder-title">Which service fits?</h2>
          <p>Choose where you are up to. The suggestion is a starting point for a conversation, not a formal recommendation.</p>
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
                const service = services.find(item => item.id === id)!
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
  return (
    <div className="stage-strip">
      <p>Where it fits</p>
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
            <h3>What it involves</h3>
            <p className="service-block__involves">{service.involves}</p>
          </Reveal>
          <div className="service-block__lists">
            <Reveal>
              <h3>Who it’s for</h3>
              <ul className="tick-list">{service.whoFor.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
            </Reveal>
            <Reveal delay={0.06}>
              <h3>When it helps</h3>
              <ul className="dash-list">{service.situations.map(item => <li key={item}>{item}</li>)}</ul>
            </Reveal>
          </div>
          <Accordion
            className="service-block__details"
            defaultOpen={null}
            multiple
            headingLevel={3}
            items={[
              { id: 'inputs', title: 'Typical inputs and documents', meta: `${service.inputs.length} items`, content: <ul className="dash-list">{service.inputs.map(item => <li key={item}>{item}</li>)}</ul> },
              { id: 'deliverables', title: 'Example deliverables', meta: `${service.deliverables.length} items`, content: <ul className="dash-list">{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul> },
            ]}
          />
          <div className="service-block__start">
            <div>
              <h3>Start a conversation</h3>
              <p>{service.conversation}</p>
            </div>
            <Link to={contactLink(service)} className="button button--primary">Enquire about this <ArrowUpRight size={17} /></Link>
          </div>
        </div>
        <Reveal className="service-block__visual">
          <div className="service-sheet" aria-hidden="true">
            <div className="service-sheet__top"><Icon size={26} strokeWidth={1.5} /><span>Example deliverable</span></div>
            <strong>{service.deliverables[0]}</strong>
            <i /><i /><i className="service-sheet__short" />
            <div className="service-sheet__plan" />
            <i /><i className="service-sheet__short" />
          </div>
          <StageStrip service={service} />
          {related.length > 0 && (
            <div className="service-block__related">
              <p>Related public updates</p>
              <ul>
                {related.map(project => (
                  <li key={project.slug}><Link to={`/projects/${project.slug}`}><img src={project.cover.src} alt="" loading="lazy" style={{ objectPosition: project.cover.position }} /><span>{project.title}<small>{project.place}</small></span></Link></li>
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
  return (
    <>
      <PageHero eyebrow="Our services" title={<>Planning support,<br /><em>made practical.</em></>} body="A guide to how Permits Hub can help at each stage of a development: what each service involves, who it suits and how to start." number="01">
        <nav className="hero-index" aria-label="Services on this page">
          <p>On this page</p>
          <ol>{services.map(service => <li key={service.id}><a href={`#${service.id}`}><span>{service.number}</span>{service.title}</a></li>)}</ol>
        </nav>
      </PageHero>

      <ServiceFinder />

      {services.map((service, index) => <ServiceBlock key={service.id} service={service} index={index} />)}

      <section className="section service-matrix" aria-labelledby="matrix-title">
        <div className="container">
          <Reveal><SectionIntro id="matrix-title" eyebrow="Project stages" title="Where each service fits." body="Most projects move through five broad stages. Some services belong to one stage; advice on zoning and controls can help at any point." /></Reveal>
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
            <span className="eyebrow eyebrow--on-dark"><span className="eyebrow__line" />Coordination</span>
            <h2 id="coordination-title">Many inputs, one clear application.</h2>
            <p>Depending on the site and proposal, a planning application can draw on several specialists. Permits Hub can help identify which inputs are likely to be needed, and in what order, so reports are based on the same drawings.</p>
            <p className="coordination__note">This shows who commonly contributes to an application. It is not a list of Permits Hub staff.</p>
          </Reveal>
          <div className="coordination__diagram">
            <div className="coordination__centre" aria-hidden="true"><span>Your application</span></div>
            <RevealGroup as="ul" className="coordination__roles">
              {coordinationRoles.map(item => <RevealItem as="li" key={item.role}><strong>{item.role}</strong><span>{item.input}</span></RevealItem>)}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section className="section engagement" aria-labelledby="engagement-title">
        <div className="container">
          <Reveal><SectionIntro id="engagement-title" eyebrow="Ways to work together" title="Start small, or plan the whole pathway." body="Example engagement formats. Scope and fees are confirmed for each project before work begins." /></Reveal>
          <RevealGroup as="ol" className="engagement__list">
            {engagementFormats.map((format, index) => (
              <RevealItem as="li" key={format.title}>
                <span className="engagement__step" aria-hidden="true">{index + 1}</span>
                <h3>{format.title}</h3>
                <p>{format.body}</p>
                <p className="engagement__suits"><span>Suits</span>{format.suits}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section prep-section" aria-labelledby="prep-title">
        <div className="container prep-section__grid">
          <Reveal>
            <SectionIntro id="prep-title" eyebrow="Before you meet" title="Preparing for a first consultation." body="None of these are required to make an enquiry. Each one makes the first conversation more specific." />
            <Link to="/contact" className="text-link">See the contact checklist <ArrowUpRight size={17} /></Link>
          </Reveal>
          <RevealGroup as="ul" className="prep-list">
            {consultationPrep.map(item => <RevealItem as="li" key={item.item}><strong>{item.item}</strong><span>{item.why}</span></RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <section className="section faq-section faq-section--tinted" aria-labelledby="services-faq-title">
        <div className="container faq-section__inner">
          <Reveal><SectionIntro id="services-faq-title" eyebrow="Questions" title={<>About our<br /><em>services.</em></>} /></Reveal>
          <Accordion items={servicesFaqs.map((faq, index) => ({ id: `services-faq-${index}`, title: faq.question, content: <p>{faq.answer}</p> }))} />
        </div>
      </section>

      <section className="services-disclaimer-section" aria-label="Disclaimer">
        <div className="container"><p className="services-disclaimer"><strong>Disclaimer –</strong> {disclaimer}</p></div>
      </section>

      <CallToAction compact title={<>Not sure where<br /><em>to start?</em></>} body="Start with the site and the idea. We can help identify the right conversation." />
    </>
  )
}
