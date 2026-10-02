import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <span className="eyebrow"><span className="eyebrow__line" />404 · Page not found</span>
        <h1>Looks like this path<br /><em>needs a new plan.</em></h1>
        <p>The page you’re looking for isn’t here.</p>
        <Link to="/" className="button button--primary">Back to home <ArrowRight size={18} /></Link>
      </div>
    </section>
  )
}
