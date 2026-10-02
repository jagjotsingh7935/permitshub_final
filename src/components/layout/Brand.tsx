import { Link } from 'react-router-dom'

export function LogoMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
      style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 6 }}
    >
      <rect width="40" height="40" rx="6" fill={inverse ? '#f7f6f2' : '#176eae'} />
      <g
        fill="none"
        stroke={inverse ? '#09243d' : '#ffffff'}
        strokeWidth="3.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M11.5 30V10.5h7.25a5.25 5.25 0 0 1 0 10.5H11.5" />
        <path d="M18.75 21H28.5" />
        <path d="M28.5 10.5V30" />
      </g>
    </svg>
  )
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label="Permits Hub home">
      <LogoMark inverse={inverse} />
      <span>Permits<span className="brand__light">Hub</span><small>Planning made clearer</small></span>
    </Link>
  )
}
