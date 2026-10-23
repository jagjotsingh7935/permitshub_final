import { Link } from 'react-router-dom'

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label="Permits Hub home">
      <img src="/images/permits-hub-logo.png" alt="" width="42" height="42" />
      <span>Permits<span className="brand__light">Hub</span><small>One Stop Development Solutions</small></span>
    </Link>
  )
}
