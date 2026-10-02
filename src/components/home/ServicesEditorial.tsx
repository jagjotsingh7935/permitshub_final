import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../../content'

export function ServicesEditorial() {
  const lead = services[0]
  return (
    <div className="services-editorial">
      <article className="service-feature">
        <div className="service-feature__meta"><span>01 · Core service</span><span>Permits Hub</span></div>
        <div className="service-feature__drawing" aria-hidden="true"><div className="service-feature__sheet"><span>PLANNING APPLICATION</span><i /><i /><i /><b>PH</b></div><div className="service-feature__stamp">REVIEW<br />THE PATHWAY</div></div>
        <div className="service-feature__copy"><span>01 / 06</span><h3>{lead.title}</h3><p>{lead.description}</p><Link to={`/services#${lead.id}`} aria-label={`Learn about ${lead.title}`}><ArrowUpRight size={22} /></Link></div>
      </article>
      <div className="service-index">
        {services.slice(1).map(service => (
          <Link to={`/services#${service.id}`} key={service.number} className="service-index__row">
            <span>{service.number}</span>
            <div><h3>{service.title}</h3><p>{service.description}</p></div>
            <ArrowUpRight size={20} />
          </Link>
        ))}
      </div>
    </div>
  )
}
