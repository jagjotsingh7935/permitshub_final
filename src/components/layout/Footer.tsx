import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useSite } from '../../site/SiteProvider'
import { Brand } from './Brand'

export function Footer() {
  const { t, settings, services } = useSite()
  const { contactEmail, contactPhone, contactPhoneHref, disclaimer, facebookUrl } = settings
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand inverse />
            <p>{t('footer.blurb')}</p>
            <div className="footer-contact">
              <a href={contactPhoneHref}>{contactPhone}</a>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            </div>
          </div>
          <div className="footer-nav">
            <div>
              <strong>{t('footer.col_services')}</strong>
              {services.slice(0, 5).map(service => <Link key={service.id} to={`/services#${service.id}`}>{service.title}</Link>)}
            </div>
            <div>
              <strong>{t('footer.col_explore')}</strong>
              <Link to="/projects">Projects</Link>
              <Link to="/about">About Permits Hub</Link>
              <Link to="/services">{t('header.all_services')}</Link>
              <Link to="/faqs">FAQs</Link>
            </div>
            <div>
              <strong>{t('footer.col_connect')}</strong>
              <Link to="/contact">Start an enquiry</Link>
              {facebookUrl && <a href={facebookUrl} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14} /><span className="sr-only"> (opens in a new tab)</span></a>}
            </div>
          </div>
        </div>
        <p className="footer-disclaimer"><strong>Disclaimer –</strong> {disclaimer}</p>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {settings.companyName}. {t('footer.rights')}</span>
          <span>{t('footer.location')}</span>
        </div>
      </div>
    </footer>
  )
}
