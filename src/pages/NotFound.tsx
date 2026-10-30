import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useSite } from '../site/SiteProvider'

export default function NotFound() {
  const { t, rt } = useSite()
  return (
    <section className="not-found">
      <div className="container">
        <span className="eyebrow"><span className="eyebrow__line" />{t('notfound.eyebrow')}</span>
        <h1>{rt('notfound.title')}</h1>
        <p>{t('notfound.body')}</p>
        <Link to="/" className="button button--primary">{t('notfound.button')} <ArrowRight size={18} /></Link>
      </div>
    </section>
  )
}
