import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useSite } from '../../site/SiteProvider'
import type { ProjectCategory } from '../../content'
import { ProjectMedia } from './ProjectMedia'

type Props = {
  /** Include clearly labelled demo projects in the counts and covers. The Home page leaves them out. */
  demos?: boolean
  /** When given, tiles filter in place instead of linking to the Projects page. */
  onSelect?: (category: ProjectCategory) => void
  active?: ProjectCategory | 'All'
}

/** The portfolio broken down by sector. Each tile opens the matching project list. */
export function PortfolioSectors({ demos = false, onSelect, active }: Props) {
  const { t, sectors: allSectors, projects } = useSite()
  const sectors = allSectors.filter(sector => sector.showInPortfolio)

  function countLabel(verified: number, demo: number) {
    const parts = []
    if (verified) parts.push(`${verified} ${verified === 1 ? t('projects.tile.update') : t('projects.tile.updates')}`)
    if (demo) parts.push(`${demo} ${t('projects.tile.demo')}`)
    return parts.length ? parts.join(' · ') : t('projects.tile.empty')
  }

  return (
    <ul className="sector-tiles" aria-label="Portfolio by sector">
      {sectors.map((sector, index) => {
        const inSector = projects.filter(project => project.category === sector.title && (demos || project.record === 'verified'))
        const verified = inSector.filter(project => project.record === 'verified').length
        const cover = inSector.find(project => project.record === 'verified') ?? inSector[0]
        const body = (
          <>
            <div className="sector-tile__media">
              {cover ? <ProjectMedia project={cover} decorative /> : <div className="sector-tile__empty" aria-hidden="true"><span>{String(index + 1).padStart(2, '0')}</span></div>}
            </div>
            <div className="sector-tile__label">
              <div>
                <strong>{sector.title}</strong>
                <small>{countLabel(verified, inSector.length - verified)}</small>
              </div>
              <ArrowUpRight size={19} aria-hidden="true" />
            </div>
          </>
        )
        return (
          <li key={sector.slug}>
            {onSelect
              ? <button type="button" className="sector-tile" aria-pressed={active === sector.title} onClick={() => onSelect(sector.title)}>{body}</button>
              : <Link to={`/projects?type=${encodeURIComponent(sector.title)}#all-projects`} className="sector-tile">{body}</Link>}
          </li>
        )
      })}
    </ul>
  )
}
