import { isVerified, type Project } from '../../content'
import { ProjectIllustration } from './ProjectIllustration'

/** The cover visual for any project: a real published image, representative photo, or labelled drawing. */
export function ProjectMedia({
  project,
  decorative = false,
  eager = false,
}: {
  project: Project
  decorative?: boolean
  eager?: boolean
}) {
  if (project.cover) {
    return (
      <div className={`project-media project-media--${project.tone}`}>
        <img
          src={project.cover.src}
          alt={decorative ? '' : project.cover.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition: project.cover.position }}
        />
        {!isVerified(project) && <span className="project-media__tag">Demo project</span>}
      </div>
    )
  }

  if (!isVerified(project)) {
    return (
      <div className={`project-media project-media--illustration project-media--${project.tone}`}>
        <ProjectIllustration variant={project.illustration} label={project.title} />
        <span className="project-media__tag">Conceptual illustration</span>
      </div>
    )
  }

  return null
}
