import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, verifiedProjects } from '../../content'
import { StatusLabel } from '../ui/Badges'
import { ProjectMedia } from './ProjectMedia'

/** Real, sourced projects only. Demo projects never appear here. */
export function ProjectShowcase() {
  const bySlug = (slug: string) => verifiedProjects.find(project => project.slug === slug)!
  const featured = bySlug('st-leonards-childcare')
  const others = [bySlug('winter-valley-swim-school'), bySlug('winchelsea-childcare')]
  return (
    <div className="project-showcase">
      <Link className="project-showcase__lead" to={`/projects/${featured.slug}`}>
        <div className="project-art"><ProjectMedia project={featured} decorative /></div>
        <div className="project-showcase__lead-body">
          <div className="project-showcase__meta"><span>Public update · {formatDate(featured.updateDate, 'short')}</span><span>{featured.category}</span></div>
          <span className="project-showcase__stat">{featured.highlight}</span>
          <h3>{featured.title}</h3>
          <p>{featured.summary}</p>
          <StatusLabel status={featured.status} note={featured.place} />
          <span className="project-showcase__action">Explore project <ArrowUpRight size={20} /></span>
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
              <span className="project-showcase__action">Explore project <ArrowUpRight size={18} /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
