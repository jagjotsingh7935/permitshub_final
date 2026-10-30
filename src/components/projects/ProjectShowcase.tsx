import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { formatDate } from '../../content'
import { useSite } from '../../site/SiteProvider'
import { StatusLabel } from '../ui/Badges'
import { ProjectMedia } from './ProjectMedia'

/** The projects chosen for the home page in the admin (Home page position 1, 2, 3). Demo projects never appear here. */
export function ProjectShowcase() {
  const { t, verifiedProjects } = useSite()
  const chosen = verifiedProjects
    .filter(project => project.homeOrder !== null)
    .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0))
  const [featured, ...others] = chosen.length ? chosen : verifiedProjects.slice(0, 3)
  if (!featured) return null
  return (
    <div className="project-showcase">
      <Link className="project-showcase__lead" to={`/projects/${featured.slug}`}>
        <div className="project-art"><ProjectMedia project={featured} decorative /></div>
        <div className="project-showcase__lead-body">
          <div className="project-showcase__meta"><span>{t('projects.showcase.meta')} · {formatDate(featured.updateDate, 'short')}</span><span>{featured.category}</span></div>
          <span className="project-showcase__stat">{featured.highlight}</span>
          <h3>{featured.title}</h3>
          <p>{featured.summary}</p>
          <StatusLabel status={featured.status} note={featured.place} />
          <span className="project-showcase__action">{t('projects.showcase.action')} <ArrowUpRight size={20} /></span>
        </div>
      </Link>
      <div className="project-showcase__side">
        {others.map(project => (
          <Link className="project-showcase__small" key={project.slug} to={`/projects/${project.slug}`}>
            <div className="project-art"><ProjectMedia project={project} decorative /></div>
            <div>
              <span>{formatDate(project.updateDate, 'short')} · {project.category}</span>
              <strong>{project.title}</strong>
              <small>{project.place}</small>
              <span className="project-showcase__action">{t('projects.showcase.action')} <ArrowUpRight size={18} /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
