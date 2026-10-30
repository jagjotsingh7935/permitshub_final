import { useSite } from '../../site/SiteProvider'
import { RevealGroup, RevealItem } from './Reveal'

/**
 * The client planning process. This is a general sequence, not company history.
 * `list` is the original ruled list; `diagram` is a horizontal process diagram on wide screens.
 */
export function PlanningJourney({ variant = 'list' }: { variant?: 'list' | 'diagram' }) {
  const { t, planningJourney } = useSite()
  if (variant === 'diagram') {
    return (
      <RevealGroup as="ol" className="journey-diagram">
        {planningJourney.map(step => (
          <RevealItem as="li" key={step.number} className="journey-diagram__step">
            <span className="journey-diagram__node" aria-hidden="true"><span>{step.number}</span></span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <p className="journey-diagram__bring"><span>{t('journey.bring')}</span>{step.bring}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    )
  }
  return (
    <ol className="journey">
      {planningJourney.map(step => (
        <li className="journey__step" key={step.number}>
          <span>{step.number}</span>
          <div><h3>{step.title}</h3><p>{step.body}</p></div>
        </li>
      ))}
    </ol>
  )
}
