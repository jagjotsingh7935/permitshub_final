import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectMedia } from '../components/projects/ProjectMedia'
import { RecordBadge, StatusLabel } from '../components/ui/Badges'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { CallToAction } from '../components/ui/Sections'
import { formatDate, isVerified, projects, typicalConsiderations, type Project } from '../content'

function relatedTo(project: Project) {
  const others = projects.filter(item => item.slug !== project.slug)
  const score = (item: Project) => (item.category === project.category ? 2 : 0) + (item.record === 'verified' ? 1 : 0)
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, 3)
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(item => item.slug === slug)

  useEffect(() => {
    document.title = project ? `${project.title} — Permits Hub` : 'Project not found — Permits Hub'
  }, [project])

  if (!project) {
    return (
      <section className="not-found">
        <div className="container">
          <span className="eyebrow"><span className="eyebrow__line" />Project not found</span>
          <h1>This project page<br /><em>isn’t here.</em></h1>
          <p>It may have moved, or the link may be incomplete.</p>
          <Link to="/projects" className="button button--primary">See all projects <ArrowRight size={18} /></Link>
        </div>
      </section>
    )
  }

  const verified = isVerified(project)
  const related = relatedTo(project)

  return (
    <>
      <section className={`project-detail-hero ${verified ? '' : 'project-detail-hero--demo'}`}>
        <div className="container">
          <Link to="/projects" className="project-detail__back"><ArrowLeft size={15} /> All projects</Link>
          <div className="project-detail-hero__badges">
            <RecordBadge record={project.record} />
            <span>{project.category}</span>
          </div>
          <h1>{project.title}</h1>
          <p className="project-detail-hero__summary">{project.summary}</p>
          {!verified && <p className="project-detail-hero__demo-note">This is a demo project: a fictional scenario used to show how a project page is structured. It is not Permits Hub work.</p>}
          <dl className="project-detail-hero__facts">
            <div><dt>Status</dt><dd><StatusLabel status={project.status} demo={!verified} /></dd></div>
            <div><dt>{verified ? 'Public update' : 'Date'}</dt><dd>{verified ? formatDate(project.updateDate) : 'Illustrative, no date'}</dd></div>
            <div><dt>Location</dt><dd>{project.place}</dd></div>
            <div><dt>Source</dt><dd>{verified ? <a href={project.sources[0].url} target="_blank" rel="noreferrer">Facebook update <ExternalLink size={13} /><span className="sr-only"> (opens in a new tab)</span></a> : 'None, fictional scenario'}</dd></div>
          </dl>
        </div>
      </section>

      <section className="section project-overview">
        <div className="container project-overview__grid">
          <Reveal>
            <figure className="project-overview__figure">
              <ProjectMedia project={project} eager />
              <figcaption>{project.cover ? project.cover.caption : 'Conceptual illustration for a demo project. Not a render or photograph of a real building.'}</figcaption>
            </figure>
          </Reveal>
          <div className="project-overview__copy">
            <Reveal>
              <h2>Overview</h2>
              <p className="project-overview__highlight">{project.highlight}</p>
              <p>{project.summary}</p>
              <dl className="fact-list">
                {project.keyFacts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
              </dl>
              {verified && <p className="project-overview__status-note">Status as reported: {project.statusNote}.</p>}
            </Reveal>
          </div>
        </div>
      </section>

      {!verified && (
        <section className="section project-context">
          <div className="container project-context__grid">
            <Reveal>
              <h2>Site context</h2>
              <p className="project-context__label">Illustrative scenario</p>
              <ul className="dash-list">{project.siteContext.map(item => <li key={item}>{item}</li>)}</ul>
            </Reveal>
            <Reveal delay={0.06}>
              <h2>Planning considerations</h2>
              <p className="project-context__label">Illustrative scenario</p>
              <ul className="dash-list">{project.planningConsiderations.map(item => <li key={item}>{item}</li>)}</ul>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section project-involvement">
        <div className="container project-involvement__grid">
          <div>
            <Reveal>
              <h2>{verified ? 'What the public update documents' : 'Illustrative role'}</h2>
              <ul className="tick-list tick-list--plain">{project.documentedInvolvement.map(item => <li key={item}>{item}</li>)}</ul>
              {verified && <p className="project-involvement__note">Site context and detailed scope are not described in the public update, so they are not stated here.</p>}
            </Reveal>
          </div>
          <div>
            <Reveal><h2>{verified ? 'Dated milestones' : 'Scenario stages'}</h2></Reveal>
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
            <Reveal><h2 id="gallery-title">{verified ? 'Project imagery' : 'Representative imagery'}</h2></Reveal>
            <div className="project-gallery__grid">
              {project.gallery.map(image => (
                <Reveal key={image.src}>
                  <figure className={`project-gallery__item project-gallery__item--${image.fit ?? 'cover'}`}>
                    <div><img src={image.src} alt={image.alt} loading="lazy" decoding="async" /></div>
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
            <h2>{verified ? 'Documented outcome' : 'Illustrative outcome'}</h2>
            <p>{project.outcome}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2>Next steps</h2>
            <p>{project.nextSteps}</p>
          </Reveal>
        </div>
      </section>

      <section className="section typical-considerations" aria-labelledby="typical-title">
        <div className="container typical-considerations__grid">
          <Reveal>
            <h2 id="typical-title">Typical considerations for this project type</h2>
            <p>General guidance for {project.category.toLowerCase()} proposals in Victoria. It is educational and does not describe this project.</p>
          </Reveal>
          <RevealGroup as="ul" className="typical-considerations__list">
            {typicalConsiderations[project.category].map(item => <RevealItem as="li" key={item}>{item}</RevealItem>)}
          </RevealGroup>
        </div>
      </section>

      <section className="section related-projects" aria-labelledby="related-title">
        <div className="container">
          <div className="section-head">
            <h2 id="related-title">Related projects</h2>
            <Link to="/projects" className="text-link">All projects <ArrowUpRight size={18} /></Link>
          </div>
          <ul className="project-grid">{related.map(item => <li key={item.slug}><ProjectCard project={item} /></li>)}</ul>
        </div>
      </section>

      <CallToAction compact title={<>Have a similar<br /><em>project?</em></>} />
    </>
  )
}
