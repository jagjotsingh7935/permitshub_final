import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { navigation } from '../../content'
import { useSite } from '../../site/SiteProvider'
import { Brand } from './Brand'

export function Header() {
  const { t, services } = useSite()
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const location = useLocation()

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpen(false)
    setServicesOpen(false)
  }

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (!open) return () => document.body.classList.remove('menu-open')
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.classList.remove('menu-open'); window.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(item => item.to === '/services' ? (
            <div key={item.to} className="nav-item">
              <NavLink to={item.to}>{item.label}<ChevronDown size={14} aria-hidden="true" /></NavLink>
              <ul className="nav-dropdown" aria-label="Services">
                {services.map(service => (
                  <li key={service.id}><Link to={`/services#${service.id}`}><span>{service.number}</span>{service.title}</Link></li>
                ))}
              </ul>
            </div>
          ) : <NavLink key={item.to} to={item.to} end={item.to === '/'}>{item.label}</NavLink>)}
        </nav>
        <Link to="/contact" className="button button--primary header-cta">{t('header.cta')} <ArrowUpRight size={17} strokeWidth={2} /></Link>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" data-lenis-prevent>
          <div className="container">
            {navigation.map((item, index) => item.to === '/services' ? (
              <div key={item.to} className="mobile-nav__group">
                <button type="button" className="mobile-nav__services" aria-expanded={servicesOpen} aria-controls="mobile-services" onClick={() => setServicesOpen(!servicesOpen)}>
                  <span>0{index + 1}</span>{item.label}<ChevronDown size={18} aria-hidden="true" />
                </button>
                {servicesOpen && (
                  <ul className="mobile-nav__sub" id="mobile-services">
                    <li><NavLink to={item.to} onClick={() => setOpen(false)}>{t('header.all_services')}</NavLink></li>
                    {services.map(service => (
                      <li key={service.id}><Link to={`/services#${service.id}`} onClick={() => setOpen(false)}><span>{service.number}</span>{service.title}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{item.label}<ArrowUpRight size={18} />
              </NavLink>
            ))}
            <p>{t('header.mobile_blurb')}</p>
          </div>
        </nav>
      )}
    </header>
  )
}
