import type { ReactNode } from 'react'
import { useSite } from '../../site/SiteProvider'
import { createIso, type Point3 } from '../../lib/iso'

/*
 * A conceptual site that evolves from bare land to a finished place, then to the next site.
 * Layers switch on and off with CSS classes (opacity + line drawing) and a camera transform moves
 * per stage. All transitions are CSS, so they reverse naturally and switch off for reduced motion.
 * This is an original illustration; it is not a Permits Hub project.
 */

const iso = createIso(8)
const ORIGIN = { x: 349, y: 113 }

/** Camera per stage: world point to centre (viewBox units) and zoom. */
const cameras: { focus: [number, number]; scale: number }[] = [
  { focus: [400, 282], scale: 1.32 },
  { focus: [398, 236], scale: 1.3 },
  { focus: [392, 250], scale: 1.4 },
  { focus: [388, 232], scale: 1.42 },
  { focus: [392, 236], scale: 1.36 },
  { focus: [408, 258], scale: 1.26 },
  { focus: [478, 292], scale: 1.06 },
]

function cameraStyle(stage: number) {
  const { focus, scale } = cameras[stage]
  return { transform: `translate(460px, 310px) scale(${scale}) translate(${-focus[0]}px, ${-focus[1]}px)` }
}

/** [first stage, last stage] each layer is visible for. */
const layers = {
  contours: [0, 1],
  siteLabels: [0, 0],
  boundary: [1, 6],
  analysis: [1, 2],
  analysisLabels: [1, 1],
  plan: [2, 3],
  planLabels: [2, 2],
  bays: [2, 6],
  structure: [3, 3],
  form: [4, 6],
  place: [5, 6],
  next: [6, 6],
} as const

type LayerName = keyof typeof layers

function Layer({ name, stage, children }: { name: LayerName; stage: number; children: ReactNode }) {
  const [from, to] = layers[name]
  const on = stage >= from && stage <= to
  return <g className={`evo-layer evo-layer--${name} ${on ? 'is-on' : ''}`} aria-hidden="true">{children}</g>
}

function Label({ at, children, anchor = 'middle' }: { at: Point3; children: string; anchor?: 'start' | 'middle' | 'end' }) {
  const [x, y] = iso.project(at)
  return <text x={x} y={y} textAnchor={anchor} className="evo-label">{children}</text>
}

function Tree({ x, y, s = 1, className = '' }: { x: number; y: number; s?: number; className?: string }) {
  const [cx, cy] = iso.project([x, y, 3.4 * s])
  const [gx, gy] = iso.project([x, y, 0])
  return (
    <g className={className}>
      <ellipse cx={gx + 4 * s} cy={gy + 1} rx={11 * s} ry={4.6 * s} className="evo-shadow" />
      <path d={iso.line([x, y, 0], [x, y, 2.6 * s])} className="evo-trunk" />
      <circle cx={cx} cy={cy} r={10 * s} className="evo-canopy" />
      <circle cx={cx - 3 * s} cy={cy - 3 * s} r={4 * s} className="evo-canopy-light" />
    </g>
  )
}

function Car({ x, y, tone }: { x: number; y: number; tone: 'navy' | 'blue' | 'sand' }) {
  const body = iso.box(x, y, 0.2, 3.8, 1.8, 0.8)
  const cabin = iso.box(x + 0.9, y + 0.15, 1, 2, 1.5, 0.6)
  return (
    <g className={`evo-car evo-car--${tone}`}>
      <path d={body.side} className="evo-car__side" /><path d={body.front} className="evo-car__front" /><path d={body.top} className="evo-car__top" />
      <path d={cabin.side} className="evo-car__glass" /><path d={cabin.front} className="evo-car__glass" /><path d={cabin.top} className="evo-car__top" />
    </g>
  )
}

function Person({ x, y, tone = 'navy' }: { x: number; y: number; tone?: 'navy' | 'blue' | 'sand' }) {
  const [hx, hy] = iso.project([x, y, 2.1])
  return (
    <g className={`evo-person evo-person--${tone}`}>
      <path d={iso.line([x, y, 0], [x, y, 1.6])} />
      <circle cx={hx} cy={hy} r={2.3} />
    </g>
  )
}

export function SiteEvolution({ stage, label }: { stage: number; label?: string }) {
  const { evolutionStages } = useSite()
  const current = evolutionStages[stage] ?? evolutionStages[0] ?? { label: '', caption: '' }

  // Geometry
  const slab = iso.box(-8, -6, -1.4, 80, 44, 1.4)
  const main = iso.box(6, 5, 0, 18, 10, 4)
  const wing = iso.box(6, 15, 0, 8, 6, 3.4)
  const roof = iso.gable(6, 5, 4, 18, 10, 2.4, 0.5)
  const sunStart = iso.project([-2, -4, 5])
  const sunMid = iso.project([16, -14, 26])
  const sunEnd = iso.project([38, -4, 5])
  const sunDot = iso.project([10, -9, 17])
  const tag = iso.project([55, 13, 5])
  const tagBase = iso.project([55, 13, 0])

  return (
    <svg className="site-evolution" viewBox="0 0 920 620" role="img" aria-label={label ?? `Conceptual illustration, stage ${stage + 1}: ${current.label}. ${current.caption}`} data-stage={stage}>
      <g className="evo-camera" style={cameraStyle(stage)}>
        <g transform={`translate(${ORIGIN.x} ${ORIGIN.y})`}>
          {/* Base: plinth, lots, street */}
          <path d={slab.front} className="evo-slab-front" />
          <path d={slab.side} className="evo-slab-side" />
          <path d={slab.top} className="evo-slab-top" />
          <path d={iso.rect(0, 0, 36, 26)} className="evo-lot" />
          <path d={iso.rect(40, 0, 30, 26)} className="evo-lot evo-lot--neighbour" />
          <path d={iso.rect(-8, 26, 80, 2.6)} className="evo-footpath" />
          <path d={iso.rect(-8, 28.6, 80, 7.4)} className="evo-road" />
          <path d={iso.line([-8, 32.3, 0], [72, 32.3, 0])} className="evo-road-line" />

          <Layer name="contours" stage={stage}>
            {[[[0, 6], [9, 4], [18, 8], [27, 5], [36, 7]], [[0, 12], [10, 10], [20, 14], [28, 12], [36, 14]], [[0, 18], [9, 17], [19, 20], [27, 18], [36, 21]]].map((points, index) => (
              <path key={index} d={iso.contour(points as [number, number][])} className="evo-contour" />
            ))}
          </Layer>
          <Layer name="siteLabels" stage={stage}>
            <Label at={[10, 7, 0]}>Existing contours</Label>
            <Label at={[20, 32.3, 0]}>Street</Label>
          </Layer>

          {/* Analysis */}
          <Layer name="analysis" stage={stage}>
            <path d={iso.rect(26, 0, 10, 9)} className="evo-overlay" />
            <path d={iso.rect(3, 3, 30, 20)} className="evo-setback" />
            <path d={`M${sunStart.join(' ')} Q${sunMid.join(' ')} ${sunEnd.join(' ')}`} className="evo-sun-arc" />
            <circle cx={sunDot[0]} cy={sunDot[1]} r={6} className="evo-sun" />
            <text x={sunDot[0] + 12} y={sunDot[1] + 4} className="evo-label">Northern sun</text>
            <path d={iso.polyline([[33, 32, 0], [33, 24, 0]])} className="evo-access evo-draw" pathLength={1} />
            <path d={iso.polyline([[31.8, 25.8, 0], [33, 24, 0], [34.2, 25.8, 0]])} className="evo-access" />
          </Layer>
          <Layer name="analysisLabels" stage={stage}>
            <Label at={[22, -1.5, 0]} anchor="start">Title boundary</Label>
            <Label at={[8, 4.5, 0]}>Setback</Label>
            <Label at={[31, 4.5, 0]}>Overlay</Label>
            <Label at={[30, 28, 0]} anchor="end">Access</Label>
          </Layer>
          <Layer name="boundary" stage={stage}>
            <path d={iso.rect(0, 0, 36, 26)} className="evo-boundary evo-draw" pathLength={1} />
          </Layer>

          {/* Plan */}
          <Layer name="bays" stage={stage}>
            <path d={iso.rect(27, 4, 8, 22)} className="evo-asphalt" />
            {[4, 7, 10, 13, 16, 19, 22].map(y => <path key={y} d={iso.line([27, y, 0], [31, y, 0])} className="evo-bay" />)}
          </Layer>
          <Layer name="plan" stage={stage}>
            <path d={iso.path([[6, 5, 0], [24, 5, 0], [24, 15, 0], [14, 15, 0], [14, 21, 0], [6, 21, 0]])} className="evo-footprint evo-draw" pathLength={1} />
            <path d={iso.polyline([[15, 5, 0], [15, 15, 0]])} className="evo-room-line" />
            <path d={iso.polyline([[6, 11, 0], [15, 11, 0]])} className="evo-room-line" />
            <path d={iso.rect(15, 15.6, 9, 6.4)} className="evo-play-outline" />
          </Layer>
          <Layer name="planLabels" stage={stage}>
            <Label at={[19.5, 10, 0]}>Rooms</Label>
            <Label at={[29, 13, 0]}>Parking</Label>
            <Label at={[19.5, 19, 0]}>Outdoor play</Label>
          </Layer>

          {/* Structure */}
          <Layer name="structure" stage={stage}>
            {main.edges.map((d, index) => <path key={`m${index}`} d={d} className="evo-frame evo-draw" pathLength={1} />)}
            {wing.edges.map((d, index) => <path key={`w${index}`} d={d} className="evo-frame evo-draw" pathLength={1} />)}
            {[6, 10.5, 15, 19.5, 24].map(x => (
              <g key={x}>
                <path d={iso.polyline([[x, 5, 4], [x, 10, 6.4], [x, 15, 4]])} className="evo-frame evo-draw" pathLength={1} />
                <path d={iso.line([x, 15, 0], [x, 15, 4])} className="evo-frame" />
              </g>
            ))}
            <path d={iso.line([6, 10, 6.4], [24, 10, 6.4])} className="evo-frame evo-draw" pathLength={1} />
            <path d={iso.rect(15, 15.6, 9, 6.4)} className="evo-play-hatch" />
          </Layer>

          {/* Form */}
          <Layer name="form" stage={stage}>
            <path d={iso.rect(15, 15.6, 9, 6.4)} className="evo-play" />
            <path d={iso.rect(9, 21, 2, 5)} className="evo-path" />
            <path d={main.side} className="evo-wall-side" />
            <path d={main.front} className="evo-wall-front" />
            {[16, 20].map(x => <path key={x} d={iso.frontPanel(15.02, x, 0.9, 3, 2.3)} className="evo-glass" />)}
            {[6.8, 11.2].map(y => <path key={y} d={iso.sidePanel(24.02, y, 0.9, 2.8, 2.3)} className="evo-glass" />)}
            <path d={roof.end} className="evo-gable" />
            <path d={roof.back} className="evo-roof-back" />
            <path d={roof.front} className="evo-roof-front" />
            <path d={roof.ridge} className="evo-ridge" />
            <path d={wing.side} className="evo-timber" />
            <path d={wing.front} className="evo-wall-front" />
            <path d={wing.top} className="evo-flat-roof" />
            <path d={iso.frontPanel(21.02, 7.5, 0, 3.4, 2.6)} className="evo-glass" />
            <path d={iso.sidePanel(14.02, 16.2, 0.9, 3.4, 1.8)} className="evo-glass" />
            <path d={iso.polyline([[15, 15.6, 1], [24, 15.6, 1], [24, 22, 1], [15, 22, 1], [15, 21, 1]])} className="evo-fence" />
          </Layer>

          {/* Place */}
          <Layer name="place" stage={stage}>
            <path d={iso.rect(0.8, 22, 4.6, 3.4)} className="evo-garden" />
            <path d={iso.path([[16, 16.4, 3.4], [23, 17, 2.7], [23.4, 21.4, 3.4], [16.4, 21, 2.7]])} className="evo-sail" />
            <Car x={27.4} y={4.6} tone="navy" />
            <Car x={27.4} y={10.6} tone="blue" />
            <Car x={27.4} y={16.6} tone="sand" />
            <Person x={10} y={24} />
            <Person x={11} y={25} tone="blue" />
            <Person x={18} y={18.5} tone="sand" />
            <Person x={21} y={20} tone="blue" />
            <Person x={20} y={17.5} />
            <Tree x={4} y={27.3} s={0.7} />
            <Tree x={16} y={27.3} s={0.7} />
            <Tree x={24} y={27.3} s={0.7} />
            <Tree x={2.5} y={14} s={0.85} />
          </Layer>

          {/* Existing trees, always present */}
          <Tree x={3} y={3} />
          <Tree x={33} y={2.5} s={0.95} />
          <Tree x={46} y={5} s={0.9} />
          <Tree x={62} y={17} s={1.05} />
          <Tree x={52} y={22} s={0.8} />

          {/* The next site */}
          <Layer name="next" stage={stage}>
            <path d={iso.rect(40, 0, 30, 26)} className="evo-next-lot" />
            <path d={iso.rect(40, 0, 30, 26)} className="evo-next-outline" />
            <path d={`M${tagBase.join(' ')} L${tag.join(' ')}`} className="evo-tag-line" />
            <g transform={`translate(${tag[0]} ${tag[1]})`} className="evo-tag">
              <rect x={-38} y={-24} width={76} height={24} rx={2} />
              <text x={0} y={-8} textAnchor="middle">Your site?</text>
            </g>
          </Layer>
        </g>
      </g>
    </svg>
  )
}
