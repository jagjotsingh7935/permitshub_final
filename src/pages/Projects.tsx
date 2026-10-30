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
import { formatDate, type ProjectCategory } from '../content'
import { useSite } from '../site/SiteProvider'

type RecordFilter = 'all' | 'verified' | 'demo'

export default function Projects() {
  const { t, rt, projects, verifiedProjects, demoProjects, sectors } = useSite()
  const featured = projects.find(project => project.featured) ?? verifiedProjects[0]
  const projectCategories = sectors.map(sector => sector.title)
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState<ProjectCategory | 'All'>(() => projectCategories.find(item => item === searchParams.get('type')) ?? 'All')
  const [record, setRecord] = useState<RecordFilter>('all')

  const available = projectCategories.filter(item => projects.some(project => project.category === item))
  const results = useMemo(
    () => projects.filter(project => (category === 'All' || project.category === category) && (record === 'all' || project.record === record)),
    [category, record, projects],
  )
  const verifiedCount = results.filter(project => project.record === 'verified').length
  const demoCount = results.length - verifiedCount
  // Removing (or hiding) every demo project in the admin removes every demo mention on this page.
  const hasDemos = demoProjects.length > 0
  const sectorNote = sectors.find(sector => sector.title === category)?.summary ?? ''

  function chooseSector(next: ProjectCategory) {
    setCategory(next)
    const target = document.getElementById('all-projects')
    if (target) scrollToElement(target, 100)
  }

  return (
    <>
      <PageHero eyebrow={t('projects.hero.eyebrow')} title={rt('projects.hero.title')} body={hasDemos ? t('projects.hero.body') : t('projects.hero.body_plain')} number="02">
        <dl className="hero-facts">
          <div><dt>{t('projects.facts.updates')}</dt><dd>{verifiedProjects.length} projects</dd></div>
          <div><dt>{t('projects.facts.recent_label')}</dt><dd>{t('projects.facts.recent')}</dd></div>
          <div><dt>{t('projects.facts.regions_label')}</dt><dd>{t('projects.facts.regions')}</dd></div>
        </dl>
      </PageHero>

      {featured && <section className="section project-feature-section" aria-labelledby="featured-title">
        <div className="container">
          <Reveal>
            <article className="project-feature">
              <Link to={`/projects/${featured.slug}`} className="project-feature__media" tabIndex={-1} aria-hidden="true">
                <ProjectMedia project={featured} decorative eager />
              </Link>
              <div className="project-feature__body">
                <p className="project-feature__kicker">{t('projects.feature.kicker')}</p>
                <h2 id="featured-title"><Link to={`/projects/${featured.slug}`}>{featured.title}</Link></h2>
                <p className="project-feature__place">{featured.place}</p>
                <p>{featured.summary} {t('projects.feature.note')}</p>
                <dl className="fact-list">
                  {featured.keyFacts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}
                </dl>
                <StatusLabel status={featured.status} note={formatDate(featured.updateDate)} />
                <div className="project-feature__actions">
                  <Link to={`/projects/${featured.slug}`} className="button button--primary">{t('projects.feature.button')} <ArrowUpRight size={17} /></Link>
                  {featured.sources[0] && <a href={featured.sources[0].url} target="_blank" rel="noreferrer" className="text-link">{t('projects.feature.link')} <ExternalLink size={15} /><span className="sr-only"> (opens in a new tab)</span></a>}
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>}

      <section className="role-section" aria-labelledby="role-title">
        <div className="container role-section__grid">
          <Reveal><h2 id="role-title">{t('projects.role.title')}</h2></Reveal>
          <Reveal className="role-section__col">
            <h3>{t('projects.role.col1_title')}</h3>
            <p>{t('projects.role.col1_body')}</p>
          </Reveal>
          <Reveal className="role-section__col" delay={0.06}>
            <h3>{t('projects.role.col2_title')}</h3>
            <p>{t('projects.role.col2_body')}</p>
          </Reveal>
        </div>
      </section>

      <section className="section portfolio-sectors" aria-labelledby="sectors-title">
        <div className="container">
          <Reveal><SectionIntro id="sectors-title" eyebrow={t('projects.sectors.eyebrow')} title={rt('projects.sectors.title')} body={t('projects.sectors.body')} /></Reveal>
          <PortfolioSectors demos={hasDemos} onSelect={chooseSector} active={category} />
        </div>
      </section>

      <section className="section project-index" id="all-projects" aria-labelledby="index-title">
        <div className="container">
          <div className="project-index__head">
            <SectionIntro id="index-title" eyebrow={t('projects.index.eyebrow')} title={t('projects.index.title')} />
            <div className="filters">
              <div className="filters__row">
                <span className="filters__label" id="filter-category">{t('projects.filter.type')}</span>
                <div className="filters__options" role="group" aria-labelledby="filter-category">
                  {(['All', ...available] as const).map(item => (
                    <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item === 'All' ? t('projects.filter.all') : item}</button>
                  ))}
                </div>
              </div>
              {hasDemos && <div className="filters__row">
                <span className="filters__label" id="filter-record">{t('projects.filter.source')}</span>
                <div className="filters__options" role="group" aria-labelledby="filter-record">
                  {([['all', t('projects.filter.all')], ['verified', t('projects.filter.verified')], ['demo', t('projects.filter.demo')]] as const).map(([value, label]) => (
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
              <p>{t('projects.empty')}</p>
              <button type="button" className="button button--outline" onClick={() => { setCategory('All'); setRecord('all') }}>{t('projects.empty_button')}</button>
            </div>
          )}
          <div className="project-index__notes">
            <p>{t('projects.note_public')}</p>
            {hasDemos && <p>{t('projects.note_demo')}</p>}
          </div>
        </div>
      </section>

      <CallToAction compact title={rt('cta.projects.title')} body={t('cta.projects.body')} />
    </>
  )
}
