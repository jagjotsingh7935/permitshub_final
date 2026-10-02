import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navigation } from '../../content'
import { Brand } from './Brand'

export function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the menu whenever the route changes.
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpen(false)
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
          {navigation.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'}>{item.label}</NavLink>)}
        </nav>
        <Link to="/contact" className="button button--primary header-cta">Discuss your project <ArrowUpRight size={17} strokeWidth={2} /></Link>
        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation" data-lenis-prevent>
          <div className="container">
            {navigation.map((item, index) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>{item.label}<ArrowUpRight size={18} />
              </NavLink>
            ))}
            <p>Town planning support for projects across Victoria.</p>
          </div>
        </nav>
      )}
    </header>
  )
}
