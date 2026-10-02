import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, isVerified, type Project } from '../../content'
import { RecordBadge, StatusLabel } from '../ui/Badges'
import { ProjectMedia } from './ProjectMedia'

export function ProjectCard({ project, headingLevel = 3 }: { project: Project; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3'
  const verified = isVerified(project)
  return (
    <article className={`project-card-v2 ${verified ? '' : 'project-card-v2--demo'}`}>
      <Link to={`/projects/${project.slug}`} className="project-card-v2__link">
        <ProjectMedia project={project} decorative />
        <div className="project-card-v2__body">
          <div className="project-card-v2__badges">
            <RecordBadge record={project.record} />
            <span className="project-card-v2__category">{project.category}</span>
          </div>
          <Heading>{project.title}</Heading>
          <p className="project-card-v2__place">{project.place}</p>
          <p className="project-card-v2__summary">{project.summary}</p>
          <div className="project-card-v2__footer">
            <StatusLabel status={project.status} demo={!verified} note={verified ? formatDate(project.updateDate, 'short') : 'No date'} />
            <span className="project-card-v2__action" aria-hidden="true"><ArrowUpRight size={19} /></span>
          </div>
        </div>
      </Link>
    </article>
  )
}
