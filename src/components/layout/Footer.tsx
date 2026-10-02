import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { contactEmail, contactPhone, contactPhoneHref, facebookUrl, services } from '../../content'
import { Brand } from './Brand'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand inverse />
            <p>Practical town planning guidance for the journey from first idea to the next stage of development.</p>
            <div className="footer-contact">
              <a href={contactPhoneHref}>{contactPhone}</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
          </div>
          <div className="footer-nav">
            <div>
              <strong>Services</strong>
              {services.slice(0, 5).map(service => <Link key={service.id} to={`/services#${service.id}`}>{service.title}</Link>)}
            </div>
            <div>
              <strong>Explore</strong>
              <Link to="/projects">Projects</Link>
              <Link to="/about">About Permits Hub</Link>
              <Link to="/services">All services</Link>
              <Link to="/faqs">FAQs</Link>
            </div>
            <div>
              <strong>Connect</strong>
              <Link to="/contact">Start an enquiry</Link>
              <a href={facebookUrl} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Permits Hub Pty Ltd. All rights reserved.</span>
          <span>Town planning and development guidance in Victoria, Australia</span>
        </div>
      </div>
    </footer>
  )
}
