import { mediaUrl } from '../../api/client'
import { isVerified, type Project } from '../../content'
import { useSite } from '../../site/SiteProvider'
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
  const { t } = useSite()
  if (project.cover) {
    return (
      <div className={`project-media project-media--${project.tone}`}>
        <img
          src={mediaUrl(project.cover.src)}
          width={project.cover.width ?? undefined}
          height={project.cover.height ?? undefined}
          alt={decorative ? '' : project.cover.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition: project.cover.position ?? undefined }}
        />
        {!isVerified(project) && <span className="project-media__tag">{t('badge.demo')}</span>}
      </div>
    )
  }

  if (!isVerified(project) && project.illustration) {
    return (
      <div className={`project-media project-media--illustration project-media--${project.tone}`}>
        <ProjectIllustration variant={project.illustration} label={project.title} />
        <span className="project-media__tag">{t('badge.illustration')}</span>
      </div>
    )
  }

  return null
}
