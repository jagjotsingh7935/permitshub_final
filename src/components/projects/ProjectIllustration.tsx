import type { JSX } from 'react'
import type { IllustrationVariant } from '../../content'
import { createIso } from '../../lib/iso'

/*
 * Conceptual illustrations for DEMO projects only. They are deliberately diagrammatic so they
 * cannot be mistaken for client renders or photographs.
 * Each drawing's outer `translate` centres it in the 520 x 360 viewBox (around 260, 170, leaving room
 * for the "Conceptual illustration" tag). Re-check the margins if a drawing's geometry changes.
 */
const iso = createIso(7)
type Box = ReturnType<typeof iso.box>

function Solid({ b, tone = 'default', top = true }: { b: Box; tone?: 'default' | 'proposal' | 'dark'; top?: boolean }) {
  return (
    <g className={`pi-solid pi-solid--${tone}`}>
      <path d={b.side} className="pi-side" />
      <path d={b.front} className="pi-front" />
      {top && <path d={b.top} className="pi-top" />}
    </g>
  )
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const [cx, cy] = iso.project([x, y, 3.6 * s])
  const [gx, gy] = iso.project([x, y, 0])
  return (
    <g>
      <ellipse cx={gx + 3} cy={gy + 1} rx={11 * s} ry={4.5 * s} className="evo-shadow" />
      <path d={iso.line([x, y, 0], [x, y, 2.6 * s])} className="evo-trunk" />
      <circle cx={cx} cy={cy} r={10 * s} className="evo-canopy" />
    </g>
  )
}

function Clinic() {
  return (
    <g transform="translate(248 68)">
      <path d={iso.rect(-4, -4, 40, 36)} className="pi-ground" />
      <path d={iso.rect(-4, 18, 40, 3)} className="evo-footpath" />
      <path d={iso.rect(-4, 21, 40, 8)} className="evo-road" />
      <Solid b={iso.box(0, 0, 0, 10, 16, 5)} />
      <Solid b={iso.box(10.5, 0, 0, 10, 16, 5.4)} tone="proposal" />
      <Solid b={iso.box(21, 0, 0, 10, 16, 5)} />
      {[1.2, 11.7, 22.2].map((x, index) => <path key={x} d={iso.frontPanel(16.02, x, 0, 7.6, 2.8)} className={index === 1 ? 'pi-glass pi-glass--proposal' : 'pi-glass'} />)}
      {[0, 10.5, 21].map(x => <path key={x} d={iso.box(x, 16, 3.1, 10, 1.8, 0.25).top} className="pi-awning" />)}
      <Solid b={iso.box(2, 23, 0, 4.4, 1.9, 1.2)} tone="dark" />
      <Solid b={iso.box(23, 23, 0, 4.4, 1.9, 1.2)} tone="dark" />
    </g>
  )
}

function Warehouse() {
  return (
    <g transform="translate(230 79)">
      <path d={iso.rect(-4, -4, 42, 32)} className="pi-ground" />
      <Solid b={iso.box(0, 0, 0, 20, 16, 7)} />
      <Solid b={iso.box(20, 0, 0, 12, 16, 6.2)} tone="proposal" />
      {[3, 9, 15].map(x => <path key={x} d={iso.frontPanel(16.02, x, 0, 3.6, 4.4)} className="pi-door" />)}
      <path d={iso.frontPanel(16.02, 23, 0, 6, 4.8)} className="pi-door pi-door--proposal" />
      <path d={iso.rect(20, 16, 14, 9)} className="pi-apron" />
      <Solid b={iso.box(22, 19, 0, 7.5, 2.8, 3)} />
      <Solid b={iso.box(29.5, 19, 0, 2.4, 2.8, 2.3)} tone="dark" />
      <Tree x={3} y={23} s={0.8} />
      <Tree x={9} y={23} s={0.8} />
      <Tree x={15} y={23} s={0.8} />
    </g>
  )
}

function Townhouses() {
  return (
    <g transform="translate(339 82)">
      <path d={iso.rect(-3, -3, 20, 46)} className="pi-ground" />
      <path d={iso.rect(12, -1, 3, 42)} className="pi-apron" />
      <Tree x={4} y={-0.5} s={1.1} />
      {[3, 15, 27].map((y, index) => {
        const roof = iso.gableY(1, y, 6, 9, 10, 3, 0.4)
        return (
          <g key={y}>
            <Solid b={iso.box(1, y, 0, 9, 10, 6)} tone={index === 2 ? 'default' : 'proposal'} top={false} />
            <path d={iso.frontPanel(y + 10.02, 3, 1, 5, 3.4)} className="pi-glass" />
            <path d={roof.left} className="evo-roof-back" />
            <path d={roof.right} className="evo-roof-front" />
            <path d={roof.end} className="pi-gable" />
          </g>
        )
      })}
      <path d={iso.rect(-3, 40, 20, 3)} className="evo-footpath" />
    </g>
  )
}

function Hall() {
  const roof = iso.gable(0, 0, 5, 18, 10, 3.6, 0.5)
  return (
    <g transform="translate(230 110)">
      <path d={iso.rect(-5, -9, 32, 30)} className="pi-ground" />
      <Solid b={iso.box(4, -7, 0, 9, 6.6, 3.6)} tone="proposal" />
      <Solid b={iso.box(0, 0, 0, 18, 10, 5)} top={false} />
      {Array.from({ length: 9 }, (_, index) => 0.55 + index * 0.5).map(z => <path key={z} d={iso.line([0, 10.02, z], [18, 10.02, z])} className="pi-weatherboard" />)}
      <path d={iso.frontPanel(10.04, 7.5, 0, 3, 3.6)} className="pi-door" />
      <path d={roof.end} className="pi-gable" />
      <path d={roof.back} className="evo-roof-back" />
      <path d={roof.front} className="evo-roof-front" />
      <path d={iso.path([[18.2, 11.5, 0], [21.2, 11.5, 0], [21.2, 3, 1], [18.2, 3, 1]])} className="pi-ramp" />
      <path d={iso.line([21.2, 11.5, 1], [21.2, 3, 2])} className="pi-rail" />
      <Tree x={-2} y={17} s={0.9} />
      <Tree x={24} y={16} s={0.8} />
    </g>
  )
}

const variants: Record<IllustrationVariant, () => JSX.Element> = { clinic: Clinic, warehouse: Warehouse, townhouses: Townhouses, hall: Hall }

export function ProjectIllustration({ variant, label }: { variant: IllustrationVariant; label: string }) {
  const Drawing = variants[variant]
  return (
    <svg className={`project-illustration project-illustration--${variant}`} viewBox="0 0 520 360" role="img" aria-label={`Conceptual illustration for a demo project: ${label}`}>
      <Drawing />
    </svg>
  )
}
