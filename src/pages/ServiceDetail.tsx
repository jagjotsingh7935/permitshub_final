import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { Accordion } from '../components/ui/Accordion'
import { ProjectCard } from '../components/projects/ProjectCard'
import { Reveal } from '../components/ui/Reveal'
import { CallToAction, PageHero } from '../components/ui/Sections'
import { useSite } from '../site/SiteProvider'
import NotFound from './NotFound'

const pad = (value: number) => String(value).padStart(2, '0')

export default function ServiceDetail() {
  const { slug } = useParams()
  const { t, services, verifiedProjects, settings } = useSite()
  const service = services.find(item => item.id === slug)
  if (!service) return <NotFound />

  const [area, name] = service.title.split(' – ')
  const related = service.relatedProjects.map(id => verifiedProjects.find(project => project.slug === id)).filter(project => project !== undefined)
  const others = services.filter(item => item.id !== service.id)
  const enquiry = `/contact?${new URLSearchParams({ projectType: service.enquiryType, service: service.title }).toString()}#enquiry`

  return (
    <>
      <PageHero eyebrow={`${t('servicepage.eyebrow')} ${service.number} / ${pad(services.length)}`} title={name ? <>{area}<br /><em>{name}</em></> : area} body={service.description} number={service.number} />

      <section className="section guide-section">
        <div className="container guide">
          <Reveal>
            <h2>{t('servicepage.overview')}</h2>
            {service.overview.map(paragraph => <p key={paragraph.slice(0, 30)}>{paragraph}</p>)}
            <Link to={enquiry} className="button button--primary">{t('servicepage.button')} <ArrowUpRight size={17} /></Link>
          </Reveal>

          {service.process.length > 0 && (
            <Reveal>
              <h2>{t('servicepage.process')}</h2>
              <ol className="journey">
                {service.process.map((step, index) => (
                  <li className="journey__step" key={step.title}><span>{pad(index + 1)}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></li>
                ))}
              </ol>
            </Reveal>
          )}

          <Reveal>
            <h2>{t('servicepage.who')}</h2>
            <ul className="tick-list">{service.whoFor.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
            <h2>{t('servicepage.when')}</h2>
            <ul className="dash-list">{service.situations.map(item => <li key={item}>{item}</li>)}</ul>
          </Reveal>

          <Reveal>
            <h2>{t('servicepage.inputs')}</h2>
            <ul className="dash-list">{service.inputs.map(item => <li key={item}>{item}</li>)}</ul>
            <h2>{t('servicepage.deliverables')}</h2>
            <ul className="tick-list">{service.deliverables.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
          </Reveal>

          {related.length > 0 && (
            <Reveal>
              <h2>{t('servicepage.related')}</h2>
              <ul className="project-grid">{related.map(project => <li key={project.slug}><ProjectCard project={project} /></li>)}</ul>
            </Reveal>
          )}

          {service.faqs.length > 0 && (
            <Reveal>
              <h2>{t('servicepage.faq')}</h2>
              <Accordion items={service.faqs.map(faq => ({ id: faq.id, title: faq.question, content: <p>{faq.answer}</p> }))} />
            </Reveal>
          )}

          <Reveal>
            <h2>{t('servicepage.more')}</h2>
            <ul className="guide-links">
              <li><Link to="/services">{t('servicepage.all')}</Link></li>
              {others.map(item => <li key={item.id}><Link to={`/services/${item.id}`}>{item.title}</Link></li>)}
            </ul>
            <p className="guide-disclaimer"><strong>Disclaimer –</strong> {settings.disclaimer}</p>
          </Reveal>
        </div>
      </section>

      <CallToAction compact />
    </>
  )
}
