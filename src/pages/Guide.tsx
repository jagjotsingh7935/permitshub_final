import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, Check } from 'lucide-react'
import { Accordion } from '../components/ui/Accordion'
import { ProjectCard } from '../components/projects/ProjectCard'
import { Reveal } from '../components/ui/Reveal'
import { CallToAction, PageHero } from '../components/ui/Sections'
import { richText, useSite } from '../site/SiteProvider'
import NotFound from './NotFound'

export default function Guide() {
  const { slug } = useParams()
  const { t, guides, projects } = useSite()
  const guide = guides.find(item => item.slug === slug)
  if (!guide) return <NotFound />

  const [lead, ...restIntro] = guide.intro
  const related = guide.relatedProjects.map(id => projects.find(project => project.slug === id)).filter(project => project !== undefined)
  const others = guides.filter(item => item.slug !== guide.slug)

  return (
    <>
      <PageHero eyebrow={t('landing.eyebrow')} title={richText(guide.title)} body={lead ?? ''} number="05" />

      <section className="section guide-section">
        <div className="container guide">
          {restIntro.length > 0 && <Reveal>{restIntro.map(paragraph => <p key={paragraph.slice(0, 30)}>{paragraph}</p>)}</Reveal>}

          {guide.sections.map(section => (
            <Reveal key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map(paragraph => <p key={paragraph.slice(0, 30)}>{paragraph}</p>)}
              {section.bullets.length > 0 && <ul className="tick-list">{section.bullets.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>}
            </Reveal>
          ))}

          {related.length > 0 && (
            <Reveal>
              <h2>{t('landing.projects')}</h2>
              <ul className="project-grid">{related.map(project => <li key={project.slug}><ProjectCard project={project} /></li>)}</ul>
            </Reveal>
          )}

          {guide.faqs.length > 0 && (
            <Reveal>
              <h2>{t('landing.faq')}</h2>
              <Accordion items={guide.faqs.map(faq => ({ id: faq.id, title: faq.question, content: <p>{faq.answer}</p> }))} />
            </Reveal>
          )}

          <Reveal>
            <Link to="/contact#enquiry" className="button button--primary">{t('landing.button')} <ArrowUpRight size={17} /></Link>
            {others.length > 0 && (
              <>
                <h2>{t('landing.more')}</h2>
                <ul className="guide-links">{others.map(item => <li key={item.slug}><Link to={`/planning/${item.slug}`}>{item.title.replaceAll('*', '')}</Link></li>)}</ul>
              </>
            )}
          </Reveal>
        </div>
      </section>

      <CallToAction compact />
    </>
  )
}
