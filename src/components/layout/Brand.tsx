import { Link } from 'react-router-dom'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label="Permits Hub home">
      <img src="/images/permits-hub-logo.jpg" alt="" width="42" height="42" />
      <span>Permits<span className="brand__light">Hub</span><small>Planning made clearer</small></span>
    </Link>
  )
}
