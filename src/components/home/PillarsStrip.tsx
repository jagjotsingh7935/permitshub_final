import { Building2, ClipboardCheck, Handshake, Users } from 'lucide-react'
import { pillars } from '../../content'

const icons = [Building2, ClipboardCheck, Users, Handshake]

/** The four service pillars from the client's brand poster. */
export function PillarsStrip() {
  return (
    <section className="pillars" aria-label="One stop development solutions">
      <div className="container pillars__inner">
        <p className="pillars__lead"><span>One stop</span> development solutions</p>
        <ul>
          {pillars.map((pillar, index) => {
            const Icon = icons[index]
            return <li key={pillar.title}><span aria-hidden="true"><Icon size={22} strokeWidth={1.5} /></span><strong>{pillar.title}</strong><small>{pillar.text}</small></li>
          })}
        </ul>
      </div>
    </section>
  )
}
