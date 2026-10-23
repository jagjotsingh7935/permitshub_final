import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { PortfolioSectors } from '../components/projects/PortfolioSectors'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectMedia } from '../components/projects/ProjectMedia'
import { StatusLabel } from '../components/ui/Badges'
import { Reveal } from '../components/ui/Reveal'
import { CallToAction, PageHero, SectionIntro } from '../components/ui/Sections'
import { scrollToElement } from '../lib/scroll'
import { demoProjects, formatDate, projectCategories, projects, sectorSummaries, verifiedProjects, type ProjectCategory } from '../content'

type RecordFilter = 'all' | 'verified' | 'demo'

export default function Projects() {
  const featured = verifiedProjects.find(project => project.slug === 'st-leonards-childcare')!
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState<ProjectCategory | 'All'>(() => projectCategories.find(item => item === searchParams.get('type')) ?? 'All')
  const [record, setRecord] = useState<RecordFilter>('all')

  const available = projectCategories.filter(item => projects.some(project => project.category === item))
  const results = useMemo(
    () => projects.filter(project => (category === 'All' || project.category === category) && (record === 'all' || project.record === record)),
    [category, record],
  )
  const verifiedCount = results.filter(project => project.record === 'verified').length
  const demoCount = results.length - verifiedCount
  // Emptying `demoProjects` in src/content/projects.ts removes every demo mention on this page.
  const hasDemos = demoProjects.length > 0
  const sectorNote = category in sectorSummaries ? sectorSummaries[category as keyof typeof sectorSummaries] : ''

  function chooseSector(next: ProjectCategory) {
    setCategory(next)
    const target = document.getElementById('all-projects')
    if (target) scrollToElement(target, 100)
  }

  return (
    <>
      <PageHero eyebrow="Our work" title={<>Planning in action.<br /><em>People in mind.</em></>} body={hasDemos ? 'Selected project updates shared publicly by Permits Hub, alongside clearly labelled demo projects that show how different planning scenarios are presented.' : 'Selected project updates shared publicly by Permits Hub.'} number="02">
        <dl className="hero-facts">
          <div><dt>Public updates</dt><dd>{verifiedProjects.length} projects</dd></div>
          <div><dt>Most recent</dt><dd>June 2025</dd></div>
          <div><dt>Regions</dt><dd>Ballarat, Greater Geelong, Surf Coast</dd></div>
        </dl>
      </PageHero>

      <section className="section project-feature-section" aria-labelledby="featured-title">
        <div className="container">
          <Reveal>
            <article className="project-feature">
              <Link to={`/projects/${featured.slug}`} className="project-feature__media" tabIndex={-1} aria-hidden="true">
                <ProjectMedia project={featured} decorative eager />
              </Link>
              <div className="project-feature__body">
                <p className="project-feature__kicker">Featured public update</p>
                <h2 id="featured-title"><Link to={`/projects/${featured.slug}`}>{featured.title}</Link></h2>
                <p className="project-feature__place">{featured.place}</p>
                <p>{featured.summary} The update described it as “10 years in the making for local families”.</p>
                <dl className="fact-list">
                  {featured.keyFacts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
                </dl>
                <StatusLabel status={featured.status} note={formatDate(featured.updateDate)} />
                <div className="project-feature__actions">
                  <Link to={`/projects/${featured.slug}`} className="button button--primary">Read the project note <ArrowUpRight size={17} /></Link>
                  <a href={featured.sources[0].url} target="_blank" rel="noreferrer" className="text-link">Original update <ExternalLink size={15} /><span className="sr-only"> (opens in a new tab)</span></a>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="role-section" aria-labelledby="role-title">
        <div className="container role-section__grid">
          <Reveal><h2 id="role-title">Our role in these projects</h2></Reveal>
          <Reveal className="role-section__col">
            <h3>What the public record shows</h3>
            <p>Permits Hub’s updates announce planning permit approvals and, for Winchelsea, a finalised building permit. Project pages repeat only what those updates say.</p>
          </Reveal>
          <Reveal className="role-section__col" delay={0.06}>
            <h3>What planning involvement usually covers</h3>
            <p>On projects like these, a town planner typically reviews the site and controls, prepares the planning report, coordinates specialist input and responds to council. Project pages keep that general guidance separate.</p>
          </Reveal>
        </div>
      </section>

      <section className="section portfolio-sectors" aria-labelledby="sectors-title">
        <div className="container">
          <Reveal><SectionIntro id="sectors-title" eyebrow="Portfolio" title={<>Our work,<br /><em>by sector.</em></>} body="Choose a sector to see its projects. Sectors without a public update yet are shown as coming soon." /></Reveal>
          <PortfolioSectors demos={hasDemos} onSelect={chooseSector} active={category} />
        </div>
      </section>

      <section className="section project-index" id="all-projects" aria-labelledby="index-title">
        <div className="container">
          <div className="project-index__head">
            <SectionIntro id="index-title" eyebrow="All projects" title="Browse by type." />
            <div className="filters">
              <div className="filters__row">
                <span className="filters__label" id="filter-category">Type</span>
                <div className="filters__options" role="group" aria-labelledby="filter-category">
                  {(['All', ...available] as const).map(item => (
                    <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
                  ))}
                </div>
              </div>
              {hasDemos && <div className="filters__row">
                <span className="filters__label" id="filter-record">Source</span>
                <div className="filters__options" role="group" aria-labelledby="filter-record">
                  {([['all', 'All'], ['verified', 'Public updates'], ['demo', 'Demo projects']] as const).map(([value, label]) => (
                    <button key={value} type="button" aria-pressed={record === value} onClick={() => setRecord(value)}>{label}</button>
                  ))}
                </div>
              </div>}
            </div>
          </div>
          {sectorNote && <p className="project-index__sector">{sectorNote}</p>}
          <p className="project-index__count" aria-live="polite">
            Showing {results.length} {results.length === 1 ? 'project' : 'projects'}{hasDemos ? `: ${verifiedCount} public ${verifiedCount === 1 ? 'update' : 'updates'}, ${demoCount} demo` : ''}.
          </p>
          {results.length ? (
            <ul className="project-grid">
              {results.map(project => <li key={project.slug}><ProjectCard project={project} /></li>)}
            </ul>
          ) : (
            <div className="project-index__empty">
              <p>No projects match those filters. Try another type, or show all sources.</p>
              <button type="button" className="button button--outline" onClick={() => { setCategory('All'); setRecord('all') }}>Clear filters</button>
            </div>
          )}
          <div className="project-index__notes">
            <p><strong>Public updates</strong> come from Permits Hub’s Facebook posts. Their visuals are renders and announcement artwork, not completed-site photographs.</p>
            {hasDemos && <p><strong>Demo projects</strong> are fictional scenarios with conceptual drawings. They show how different project types are presented and are not Permits Hub work.</p>}
          </div>
        </div>
      </section>

      <CallToAction compact title={<>Planning something<br /><em>similar?</em></>} body="Share the site, the idea and where you are up to. The team can talk through a sensible first step." />
    </>
  )
}
