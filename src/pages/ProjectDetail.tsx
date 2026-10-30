import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react'
import { mediaUrl } from '../api/client'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectMedia } from '../components/projects/ProjectMedia'
import { RecordBadge, StatusLabel } from '../components/ui/Badges'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction } from '../components/ui/Sections'
import { formatDate, isVerified, type Project } from '../content'
import { useSite } from '../site/SiteProvider'

function relatedTo(project: Project, projects: Project[]) {
  const others = projects.filter(item => item.slug !== project.slug)
  const score = (item: Project) => (item.category === project.category ? 2 : 0) + (item.record === 'verified' ? 1 : 0)
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, 3)
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const { t, rt, projects, sectors } = useSite()
  const project = projects.find(item => item.slug === slug)

  if (!project) {
    return (
      <section className="not-found">
        <div className="container">
          <span className="eyebrow"><span className="eyebrow__line" />{t('project.not_found_eyebrow')}</span>
          <h1>{rt('project.not_found_title')}</h1>
          <p>{t('project.not_found_body')}</p>
          <Link to="/projects" className="button button--primary">{t('project.not_found_button')} <ArrowRight size={18} /></Link>
        </div>
      </section>
    )
  }

  const verified = isVerified(project)
  const related = relatedTo(project, projects)
  const considerations = sectors.find(sector => sector.title === project.category)?.considerations ?? []

  return (
    <>
      <section className={`project-detail-hero ${verified ? '' : 'project-detail-hero--demo'}`}>
        <div className="container">
          <Link to="/projects" className="project-detail__back"><ArrowLeft size={15} /> {t('project.back')}</Link>
          <div className="project-detail-hero__badges">
            <RecordBadge record={project.record} />
            <span>{project.category}</span>
          </div>
          <h1>{project.title}</h1>
          <p className="project-detail-hero__summary">{project.summary}</p>
          {!verified && <p className="project-detail-hero__demo-note">{t('project.demo_note')}</p>}
          <dl className="project-detail-hero__facts">
            <div><dt>{t('project.fact_status')}</dt><dd><StatusLabel status={project.status} demo={!verified} /></dd></div>
            <div><dt>{verified ? t('project.fact_update') : t('project.fact_date')}</dt><dd>{verified ? formatDate(project.updateDate) : t('project.fact_date_demo')}</dd></div>
            <div><dt>{t('project.fact_location')}</dt><dd>{project.place}</dd></div>
            <div><dt>{t('project.fact_source')}</dt><dd>{verified && project.sources[0] ? <a href={project.sources[0].url} target="_blank" rel="noreferrer">{t('project.source_link')} <ExternalLink size={13} /><span className="sr-only"> (opens in a new tab)</span></a> : t('project.source_none')}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section project-overview">
        <div className="container project-overview__grid">
          <Reveal>
            <figure className="project-overview__figure">
              <ProjectMedia project={project} eager />
              <figcaption>{project.cover ? project.cover.caption : t('project.caption_demo')}</figcaption>
            </figure>
          </Reveal>
          <div className="project-overview__copy">
            <Reveal>
              <h2>{t('project.overview')}</h2>
              <p className="project-overview__highlight">{project.highlight}</p>
              <p>{project.summary}</p>
              <dl className="fact-list">
                {project.keyFacts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
              </dl>
              {verified && <p className="project-overview__status-note">{t('project.status_note')} {project.statusNote}.</p>}
            </Reveal>
          </div>
        </div>
      </section>

      {!verified && (
        <section className="section project-context">
          <div className="container project-context__grid">
            <Reveal>
              <h2>{t('project.context')}</h2>
              <p className="project-context__label">{t('project.scenario_label')}</p>
              <ul className="dash-list">{project.siteContext.map(item => <li key={item}>{item}</li>)}</ul>
            </Reveal>
            <Reveal delay={0.06}>
              <h2>{t('project.considerations')}</h2>
              <p className="project-context__label">{t('project.scenario_label')}</p>
              <ul className="dash-list">{project.planningConsiderations.map(item => <li key={item}>{item}</li>)}</ul>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section project-involvement">
        <div className="container project-involvement__grid">
          <div>
            <Reveal>
              <h2>{verified ? t('project.documented') : t('project.role_demo')}</h2>
              <ul className="tick-list tick-list--plain">{project.documentedInvolvement.map(item => <li key={item}>{item}</li>)}</ul>
              {verified && <p className="project-involvement__note">{t('project.involvement_note')}</p>}
            </Reveal>
          </div>
          <div>
            <Reveal><h2>{verified ? t('project.milestones') : t('project.milestones_demo')}</h2></Reveal>
            <RevealGroup as="ol" className="milestones">
              {project.milestones.map(item => (
                <RevealItem as="li" key={`${item.when}-${item.label}`}>
                  <span className="milestones__when">{formatDate(item.when)}</span>
                  <h3>{item.label}</h3>
                  <p>{item.detail}</p>
                  {item.source && <a href={item.source.url} target="_blank" rel="noreferrer">{item.source.label} <ExternalLink size={13} /><span className="sr-only"> (opens in a new tab)</span></a>}
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {project.gallery && project.gallery.length > 0 && (
        <section className="section project-gallery" aria-labelledby="gallery-title">
          <div className="container">
            <Reveal><h2 id="gallery-title">{verified ? t('project.gallery') : t('project.gallery_demo')}</h2></Reveal>
            <div className="project-gallery__grid">
              {project.gallery.map(image => (
                <Reveal key={image.src}>
                  <figure className={`project-gallery__item project-gallery__item--${image.fit ?? 'cover'}`}>
                    <div><img src={mediaUrl(image.src)} alt={image.alt} width={image.width ?? undefined} height={image.height ?? undefined} loading="lazy" decoding="async" /></div>
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section project-outcome">
        <div className="container project-outcome__grid">
          <Reveal>
            <h2>{verified ? t('project.outcome') : t('project.outcome_demo')}</h2>
            <p>{project.outcome}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2>{t('project.next')}</h2>
            <p>{project.nextSteps}</p>
          </Reveal>
        </div>
      </section>

      <section className="section typical-considerations" aria-labelledby="typical-title">
        <div className="container typical-considerations__grid">
          <Reveal>
            <h2 id="typical-title">{t('project.typical_title')}</h2>
            <p>{t('project.typical_body').replace('{category}', project.category.toLowerCase())}</p>
          </Reveal>
          <RevealGroup as="ul" className="typical-considerations__list">
            {considerations.map(item => <RevealItem as="li" key={item}>{item}</RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <section className="section related-projects" aria-labelledby="related-title">
        <div className="container">
          <div className="section-head">
            <h2 id="related-title">{t('project.related')}</h2>
            <Link to="/projects" className="text-link">{t('project.related_link')} <ArrowUpRight size={18} /></Link>
          </div>
          <ul className="project-grid">{related.map(item => <li key={item.slug}><ProjectCard project={item} /></li>)}</ul>
        </div>
      </section>

      <CallToAction compact title={rt('cta.project.title')} />
    </>
  )
}
