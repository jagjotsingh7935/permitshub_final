import { Building2, ClipboardCheck, Handshake, Users } from 'lucide-react'
import { useSite } from '../../site/SiteProvider'

const icons = [Building2, ClipboardCheck, Users, Handshake]

/** The four service pillars from the client's brand poster. */
export function PillarsStrip() {
  const { t, pillars } = useSite()
  return (
    <section className="pillars" aria-label="One stop development solutions">
      <div className="container pillars__inner">
        <p className="pillars__lead"><span>{t('home.pillars.lead_strong')}</span> {t('home.pillars.lead_rest')}</p>
        <ul>
          {pillars.map((pillar, index) => {
            const Icon = icons[index % icons.length]
            return <li key={pillar.title}><span aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span><strong>{pillar.title}</strong><small>{pillar.text}</small></li>
          })}
        </ul>
      </div>
    </section>
  )
}
