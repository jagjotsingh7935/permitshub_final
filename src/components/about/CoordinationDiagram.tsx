import { useId } from 'react'

const parties = ['Council', 'Designer', 'Engineers', 'Specialists', 'Surveyor', 'Builder']

const NODE_W = 124
const NODE_H = 36

function Node({
  cx,
  cy,
  label,
  emphasis = false,
  width = NODE_W,
}: {
  cx: number
  cy: number
  label: string
  emphasis?: boolean
  width?: number
}) {
  return (
    <g className="coordination-node">
      <rect
        x={cx - width / 2}
        y={cy - NODE_H / 2}
        width={width}
        height={NODE_H}
        rx="4"
        fill={emphasis ? 'var(--blue, #1f72d8)' : '#071c38'}
        stroke={emphasis ? 'var(--blue, #1f72d8)' : 'rgba(110, 185, 245, 0.45)'}
        strokeWidth="1.2"
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill="#ffffff"
        fontSize="14"
        fontWeight="600"
        fontFamily="Manrope, 'DM Sans', sans-serif"
      >
        {label}
      </text>
    </g>
  )
}

/** Without a coordinator: every party connects to you and to each other chaotically. */
export function WithoutCoordination() {
  const id = useId()
  const left = 70
  const right = 290
  const nodes = [
    { cx: left, cy: 40, label: parties[0] },
    { cx: right, cy: 40, label: parties[1] },
    { cx: left, cy: 150, label: parties[2] },
    { cx: right, cy: 150, label: parties[3] },
    { cx: left, cy: 260, label: parties[4] },
    { cx: right, cy: 260, label: parties[5] },
  ]
  const you = { cx: 180, cy: 150 }

  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby={`${id}-t ${id}-d`} className="coordination-svg">
      <title id={`${id}-t`}>Without one point of coordination</title>
      <desc id={`${id}-d`}>
        You deal separately with council, the designer, engineers, specialist consultants, the building surveyor and the
        builder, and they also need to exchange information with each other.
      </desc>
      <g stroke="rgba(110, 185, 245, 0.35)" strokeWidth="1">
        {nodes.map((n) => (
          <line key={n.label} x1={you.cx} y1={you.cy} x2={n.cx} y2={n.cy} />
        ))}
      </g>
      <g stroke="rgba(110, 185, 245, 0.25)" strokeWidth="1" strokeDasharray="4 4" fill="none">
        <path d="M70 40 C 170 90, 200 200, 290 260" />
        <path d="M290 40 C 200 90, 150 210, 70 260" />
        <path d="M70 150 C 140 60, 230 60, 290 150" />
        <path d="M70 40 L70 150" />
        <path d="M290 150 L290 260" />
      </g>
      {nodes.map((n) => (
        <Node key={n.label} {...n} />
      ))}
      <Node cx={you.cx} cy={you.cy} label="You" width={64} emphasis />
    </svg>
  )
}

/** With Permits Hub: one clear line from you, then organised connections. */
export function WithCoordination() {
  const id = useId()
  const hub = { cx: 160, cy: 150 }
  const ys = [28, 77, 126, 175, 224, 273]

  return (
    <svg viewBox="0 0 360 300" role="img" aria-labelledby={`${id}-t ${id}-d`} className="coordination-svg">
      <title id={`${id}-t`}>With one point of coordination</title>
      <desc id={`${id}-d`}>
        You deal with Permits Hub, which coordinates council, the designer, engineers, specialist consultants, the
        building surveyor and the builder.
      </desc>
      <line x1="60" y1="150" x2="108" y2="150" stroke="#67b1ff" strokeWidth="1.75" />
      <g stroke="rgba(110, 185, 245, 0.5)" strokeWidth="1.2" fill="none">
        {ys.map((y) => (
          <path key={y} d={`M212 150 C 232 150, 220 ${y}, 240 ${y}`} />
        ))}
      </g>
      <Node cx={34} cy={150} label="You" width={56} emphasis />
      <Node cx={hub.cx} cy={hub.cy} label="Permits Hub" width={104} emphasis />
      {ys.map((y, i) => (
        <Node key={y} cx={298} cy={y} label={parties[i]} width={116} />
      ))}
    </svg>
  )
}
