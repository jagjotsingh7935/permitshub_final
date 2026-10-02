import { statusLabels, type ProjectStatus } from '../../content'

/** Distinguishes sourced public updates from fictional demo scenarios. Always visible on demo content. */
export function RecordBadge({ record, className = '' }: { record: 'verified' | 'demo'; className?: string }) {
  return record === 'demo'
    ? <span className={`record-badge record-badge--demo ${className}`}>Demo project</span>
    : <span className={`record-badge record-badge--verified ${className}`}>Public update</span>
}

export function IllustrativeTag({ children = 'Illustrative example', className = '' }: { children?: string; className?: string }) {
  return <span className={`record-badge record-badge--demo ${className}`}>{children}</span>
}

export function StatusLabel({ status, note, demo = false }: { status: ProjectStatus; note?: string; demo?: boolean }) {
  return (
    <span className={`status-label status-label--${status}`}>
      <i aria-hidden="true" />
      <span>{demo ? `Illustrative: ${statusLabels[status].toLowerCase()}` : statusLabels[status]}</span>
      {note && <small>{note}</small>}
    </span>
  )
}
