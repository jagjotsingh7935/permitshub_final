import { statusLabels, type ProjectStatus } from '../../content'
import { useSite } from '../../site/SiteProvider'

/** Distinguishes sourced public updates from fictional demo scenarios. Always visible on demo content. */
export function RecordBadge({ record, className = '' }: { record: 'verified' | 'demo'; className?: string }) {
  const { t } = useSite()
  return record === 'demo'
    ? <span className={`record-badge record-badge--demo ${className}`}>{t('badge.demo')}</span>
    : <span className={`record-badge record-badge--verified ${className}`}>{t('badge.verified')}</span>
}

export function StatusLabel({ status, note, demo = false }: { status: ProjectStatus; note?: string; demo?: boolean }) {
  const { t } = useSite()
  return (
    <span className={`status-label status-label--${status}`}>
      <i aria-hidden="true" />
      <span>{demo ? `${t('status.illustrative')} ${statusLabels[status].toLowerCase()}` : statusLabels[status]}</span>
      {note && <small>{note}</small>}
    </span>
  )
}
